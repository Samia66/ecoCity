import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RoleService } from '../../services/role.service';
import { Permission, Role } from '../../models/role.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'eco-permission-matrix',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCheckboxModule, PageHeaderComponent, CardComponent, ButtonComponent, LoadingSpinnerComponent],
  templateUrl: './permission-matrix.component.html',
  styleUrl: './permission-matrix.component.scss',
})
export class PermissionMatrixComponent implements OnInit {
  private roleService = inject(RoleService);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  saving = signal(false);
  roles = signal<Role[]>([]);
  permissions = signal<Permission[]>([]);
  matrix = signal<Record<string, Set<string>>>({});

  private readonly MOCK_PERMISSIONS: Permission[] = [
    { id: 'p1', code: 'reports.create', label: 'Créer un signalement', module: 'Signalements' },
    { id: 'p2', code: 'reports.manage', label: 'Gérer les signalements', module: 'Signalements' },
    { id: 'p3', code: 'interventions.view', label: 'Voir les interventions', module: 'Interventions' },
    { id: 'p4', code: 'interventions.update', label: 'Mettre à jour les interventions', module: 'Interventions' },
    { id: 'p5', code: 'users.manage', label: 'Gérer les utilisateurs', module: 'Utilisateurs' },
    { id: 'p6', code: 'organizations.manage', label: 'Gérer les organisations', module: 'Organisations' },
    { id: 'p7', code: 'settings.manage', label: 'Gérer les paramètres', module: 'Paramètres' },
  ];

  private readonly MOCK_ROLES: Role[] = [
    { id: 'r1', name: 'Super Admin', description: '', usersCount: 2, permissionCodes: this.MOCK_PERMISSIONS.map((p) => p.code), createdAt: '' },
    { id: 'r2', name: "Admin d'organisation", description: '', usersCount: 8, permissionCodes: ['reports.manage', 'interventions.view', 'interventions.update', 'users.manage'], createdAt: '' },
    { id: 'r3', name: 'Agent / Technicien', description: '', usersCount: 34, permissionCodes: ['interventions.view', 'interventions.update'], createdAt: '' },
    { id: 'r4', name: 'Citoyen', description: '', usersCount: 1204, permissionCodes: ['reports.create'], createdAt: '' },
  ];

  get modules(): string[] {
    return [...new Set(this.permissions().map((p) => p.module))];
  }

  ngOnInit(): void {
    this.loading.set(true);
    this.roleService.getPermissions().subscribe({
      next: (perms) => this.permissions.set(perms),
      error: () => this.permissions.set(this.MOCK_PERMISSIONS),
    });

    this.roleService.getAll().subscribe({
      next: (roles) => this.setRoles(roles),
      error: () => this.setRoles(this.MOCK_ROLES),
    });
  }

  private setRoles(roles: Role[]): void {
    this.roles.set(roles);
    const map: Record<string, Set<string>> = {};
    roles.forEach((role) => { map[role.id] = new Set(role.permissionCodes); });
    this.matrix.set(map);
    this.loading.set(false);
  }

  permissionsForModule(module: string): Permission[] {
    return this.permissions().filter((p) => p.module === module);
  }

  isChecked(roleId: string, code: string): boolean {
    return this.matrix()[roleId]?.has(code) ?? false;
  }

  toggle(roleId: string, code: string): void {
    const map = this.matrix();
    const set = map[roleId] ?? new Set<string>();
    set.has(code) ? set.delete(code) : set.add(code);
    this.matrix.set({ ...map, [roleId]: set });
  }

  save(): void {
    this.saving.set(true);
    const map = this.matrix();
    const requests = Object.keys(map).map((roleId) =>
      this.roleService.updatePermissions(roleId, Array.from(map[roleId])),
    );

    Promise.allSettled(requests.map((r) => r.toPromise())).finally(() => {
      this.saving.set(false);
      this.snackBar.open('Matrice des permissions enregistrée', 'Fermer', { duration: 3000 });
    });
  }
}

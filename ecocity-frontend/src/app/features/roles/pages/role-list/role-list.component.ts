import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'eco-role-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatMenuModule, PageHeaderComponent, CardComponent, ButtonComponent, LoadingSpinnerComponent],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
})
export class RoleListComponent implements OnInit {
  private roleService = inject(RoleService);
  private dialog = inject(MatDialog);

  loading = signal(true);
  roles = signal<Role[]>([]);

  private readonly MOCK: Role[] = [
    { id: 'r1', name: 'Super Admin', description: 'Accès complet à la plateforme', usersCount: 2, permissionCodes: ['*'], createdAt: '2025-09-01' },
    { id: 'r2', name: "Admin d'organisation", description: "Gestion d'une municipalité", usersCount: 8, permissionCodes: ['users.manage', 'reports.manage'], createdAt: '2025-09-01' },
    { id: 'r3', name: 'Agent / Technicien', description: 'Intervention terrain', usersCount: 34, permissionCodes: ['interventions.view', 'interventions.update'], createdAt: '2025-09-01' },
    { id: 'r4', name: 'Citoyen', description: 'Création de signalements', usersCount: 1204, permissionCodes: ['reports.create'], createdAt: '2025-09-01' },
  ];

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {

    this.loading.set(true);

    this.roleService.getAll().subscribe({

      next: (res: any) => {

        this.roles.set(
          res.data.data ?? [],
        );

        this.loading.set(false);

      },

      error: () => {

        this.roles.set(
          this.MOCK,
        );

        this.loading.set(false);

      },

    });

  }

  remove(role: Role): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Supprimer le rôle', message: `Confirmez-vous la suppression du rôle "${role.name}" ?`, danger: true },
    }).afterClosed().subscribe((confirmed) => { if (confirmed) this.roleService.delete(role.id).subscribe({ complete: () => this.fetch() }); });
  }
}

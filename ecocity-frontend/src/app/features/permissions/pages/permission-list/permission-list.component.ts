import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { PermissionService } from '../../services/permission.service';
import { Permission } from '../../../roles/models/role.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { DataTableComponent } from '../../../../shared/ui/data-table/data-table.component';
import { EcoTableColumn } from '../../../../shared/ui/data-table/data-table.model';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'eco-permission-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, PageHeaderComponent, DataTableComponent, ButtonComponent],
  templateUrl: './permission-list.component.html',
})
export class PermissionListComponent implements OnInit {
  private permissionService = inject(PermissionService);

  loading = signal(true);
  permissions = signal<Permission[]>([]);

  columns: EcoTableColumn<Permission>[] = [
    { key: 'label', label: 'Permission', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'module', label: 'Module', sortable: true },
  ];

  private readonly MOCK: Permission[] = [
    { id: 'p1', code: 'reports.create', label: 'Créer un signalement', module: 'Signalements' },
    { id: 'p2', code: 'reports.manage', label: 'Gérer les signalements', module: 'Signalements' },
    { id: 'p3', code: 'interventions.view', label: 'Voir les interventions', module: 'Interventions' },
    { id: 'p4', code: 'interventions.update', label: 'Mettre à jour les interventions', module: 'Interventions' },
    { id: 'p5', code: 'users.manage', label: 'Gérer les utilisateurs', module: 'Utilisateurs' },
    { id: 'p6', code: 'organizations.manage', label: 'Gérer les organisations', module: 'Organisations' },
    { id: 'p7', code: 'settings.manage', label: 'Gérer les paramètres', module: 'Paramètres' },
  ];

  ngOnInit(): void {
    this.permissionService.getAll().subscribe({
      next: (data) => { this.permissions.set(data); this.loading.set(false); },
      error: () => { this.permissions.set(this.MOCK); this.loading.set(false); },
    });
  }
}

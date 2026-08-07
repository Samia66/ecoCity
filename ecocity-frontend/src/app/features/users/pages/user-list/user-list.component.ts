import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { UserService } from '../../services/user.service';
import { UserItem } from '../../models/user.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { DataTableComponent } from '../../../../shared/ui/data-table/data-table.component';
import { EcoTableColumn } from '../../../../shared/ui/data-table/data-table.model';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { ROLE_LABELS } from '../../../../core/constants/app.constants';

@Component({
  selector: 'eco-user-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, PageHeaderComponent, DataTableComponent, ButtonComponent],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  loading = signal(true);
  users = signal<UserItem[]>([]);

  columns: EcoTableColumn<UserItem>[] = [
    { key: 'firstName', label: 'Prénom', sortable: true },
    { key: 'lastName', label: 'Nom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Rôle', sortable: true, accessor: (row) => ROLE_LABELS[row.role] ?? row.role },
    { key: 'organizationName', label: 'Organisation' },
  ];

  private readonly MOCK: UserItem[] = [
    { id: 'u1', firstName: 'Olivia', lastName: 'Fanou', email: 'o.fanou@cotonou.bj', role: 'ADMIN_ORGANISATION', organizationName: 'Mairie de Cotonou', organizationId: 'o1', active: true, createdAt: '2026-01-10' },
    { id: 'u2', firstName: 'Roland', lastName: 'Dansou', email: 'r.dansou@cotonou.bj', role: 'AGENT', organizationName: 'Mairie de Cotonou', organizationId: 'o1', active: true, createdAt: '2026-02-14' },
    { id: 'u3', firstName: 'Aïcha', lastName: 'Kouassi', email: 'a.kouassi@gmail.com', role: 'CITOYEN', organizationName: '-', organizationId: '', active: true, createdAt: '2026-03-02' },
  ];

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (res) => { this.users.set(res.data); this.loading.set(false); },
      error: () => { this.users.set(this.MOCK); this.loading.set(false); },
    });
  }

  openCreate(): void {
    this.dialog.open(UserFormComponent, { data: {} }).afterClosed().subscribe((res) => { if (res) this.fetch(); });
  }

  openEdit(user: UserItem): void {
    this.dialog.open(UserFormComponent, { data: { user } }).afterClosed().subscribe((res) => { if (res) this.fetch(); });
  }

  remove(user: UserItem, event: Event): void {
    event.stopPropagation();
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: "Supprimer l'utilisateur", message: `Confirmez-vous la suppression de ${user.firstName} ${user.lastName} ?`, danger: true },
    }).afterClosed().subscribe((confirmed) => { if (confirmed) this.userService.delete(user.id).subscribe({ complete: () => this.fetch() }); });
  }
}

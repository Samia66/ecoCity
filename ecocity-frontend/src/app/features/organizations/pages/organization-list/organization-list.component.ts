import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { OrganizationService } from '../../services/organization.service';
import { Organization } from '../../models/organization.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { DataTableComponent } from '../../../../shared/ui/data-table/data-table.component';
import { EcoTableColumn } from '../../../../shared/ui/data-table/data-table.model';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { OrganizationFormComponent } from '../organization-form/organization-form.component';

@Component({
  selector: 'eco-organization-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, PageHeaderComponent, DataTableComponent, ButtonComponent],
  templateUrl: './organization-list.component.html',
})
export class OrganizationListComponent implements OnInit {
  private organizationService = inject(OrganizationService);
  private dialog = inject(MatDialog);

  loading = signal(true);
  organizations = signal<Organization[]>([]);

  columns: EcoTableColumn<Organization>[] = [
    { key: 'name', label: 'Organisation', sortable: true },
    { key: 'city', label: 'Ville', sortable: true },
    { key: 'usersCount', label: 'Utilisateurs' },
    { key: 'reportsCount', label: 'Signalements' },
    { key: 'createdAt', label: 'Créée le', type: 'date', sortable: true },
  ];

  private readonly MOCK: Organization[] = [
    { id: 'o1', name: 'Mairie de Cotonou', city: 'Cotonou', address: 'Place de l\u2019Étoile Rouge', phone: '+229 21 30 00 00', email: 'contact@cotonou.bj', usersCount: 42, reportsCount: 812, active: true, createdAt: '2025-11-02' },
    { id: 'o2', name: 'Mairie de Porto-Novo', city: 'Porto-Novo', address: 'Avenue Jean Bayol', phone: '+229 20 21 00 00', email: 'contact@porto-novo.bj', usersCount: 18, reportsCount: 234, active: true, createdAt: '2025-12-10' },
  ];

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.organizationService.getAll().subscribe({
      next: (res) => { this.organizations.set(res.data); this.loading.set(false); },
      error: () => { this.organizations.set(this.MOCK); this.loading.set(false); },
    });
  }

  openCreate(): void {
    this.dialog.open(OrganizationFormComponent, { data: {} }).afterClosed().subscribe((res) => { if (res) this.fetch(); });
  }

  openEdit(organization: Organization): void {
    this.dialog.open(OrganizationFormComponent, { data: { organization } }).afterClosed().subscribe((res) => { if (res) this.fetch(); });
  }

  remove(organization: Organization, event: Event): void {
    event.stopPropagation();
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: "Supprimer l'organisation", message: `Confirmez-vous la suppression de "${organization.name}" ?`, danger: true },
    }).afterClosed().subscribe((confirmed) => { if (confirmed) this.organizationService.delete(organization.id).subscribe({ complete: () => this.fetch() }); });
  }
}

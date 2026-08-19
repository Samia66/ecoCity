import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ZoneService } from '../services/zone.service';
import { Zone } from '../models/zone.model';
import { PageHeaderComponent } from '../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { ZoneFormDialogComponent } from '../dialogs/zone-form-dialog.component';

@Component({
  selector: 'eco-zone-list-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    PageHeaderComponent,
    CardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './zone-list-page.component.html',
  styleUrl: './zone-list-page.component.scss',
})
export class ZoneListPageComponent implements OnInit {
  private zoneService = inject(ZoneService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  zones = signal<Zone[]>([]);

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.zoneService.getAll().subscribe({
      next: (zones) => {
        this.zones.set(zones);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Impossible de charger les zones.', 'Fermer', { duration: 4000 });
      },
    });
  }

  openCreate(): void {
    this.dialog
      .open(ZoneFormDialogComponent, { data: {} })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.snackBar.open('Zone créée avec succès.', 'Fermer', { duration: 3000 });
          this.fetch();
        }
      });
  }

  openEdit(zone: Zone): void {
    this.dialog
      .open(ZoneFormDialogComponent, { data: { zone } })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.snackBar.open('Zone mise à jour avec succès.', 'Fermer', { duration: 3000 });
          this.fetch();
        }
      });
  }

  remove(zone: Zone): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Supprimer la zone',
          message: `Confirmez-vous la suppression de la zone "${zone.name}" ?`,
          danger: true,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.zoneService.delete(zone.id).subscribe({
            complete: () => {
              this.snackBar.open('Zone supprimée.', 'Fermer', { duration: 3000 });
              this.fetch();
            },
            error: () => {
              this.snackBar.open('Impossible de supprimer cette zone.', 'Fermer', { duration: 4000 });
            },
          });
        }
      });
  }
}

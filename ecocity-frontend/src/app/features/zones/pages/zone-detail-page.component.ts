import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { ZoneService } from '../services/zone.service';
import { CollectionScheduleService } from '../services/collection-schedule.service';
import { Zone } from '../models/zone.model';
import { CollectionSchedule } from '../models/collection-schedule.model';
import { DAY_LABELS } from '../../teams/models/team.model';
import { PageHeaderComponent } from '../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { ScheduleFormDialogComponent } from '../dialogs/schedule-form-dialog.component';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'eco-zone-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    PageHeaderComponent,
    CardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './zone-detail-page.component.html',
  styleUrl: './zone-detail-page.component.scss',
})
export class ZoneDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private zoneService = inject(ZoneService);
  private scheduleService = inject(CollectionScheduleService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private authStore = inject(AuthStore);

  readonly dayLabels = DAY_LABELS;

  loading = signal(true);
  zone = signal<Zone | null>(null);
  schedules = signal<CollectionSchedule[]>([]);
  canManage = computed(() => this.authStore.hasPermission('collection-schedules.manage'));

  private zoneId!: string;

  ngOnInit(): void {
    this.zoneId = this.route.snapshot.paramMap.get('id')!;
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    forkJoin({
      zone: this.zoneService.getById(this.zoneId),
      schedules: this.scheduleService.getByZone(this.zoneId),
    }).subscribe({
      next: ({ zone, schedules }) => {
        this.zone.set(zone);
        this.schedules.set(schedules);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Impossible de charger cette zone.', 'Fermer', { duration: 4000 });
      },
    });
  }

  openCreate(): void {
    const zone = this.zone();
    if (!zone) return;

    this.dialog
      .open(ScheduleFormDialogComponent, { data: { zoneId: zone.id, zoneTeams: zone.teams ?? [] } })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.snackBar.open('Jour de collecte ajouté.', 'Fermer', { duration: 3000 });
          this.fetch();
        }
      });
  }

  openEdit(schedule: CollectionSchedule): void {
    const zone = this.zone();
    if (!zone) return;

    this.dialog
      .open(ScheduleFormDialogComponent, { data: { zoneId: zone.id, zoneTeams: zone.teams ?? [], schedule } })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.snackBar.open('Planning mis à jour.', 'Fermer', { duration: 3000 });
          this.fetch();
        }
      });
  }

  remove(schedule: CollectionSchedule): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Supprimer ce jour de collecte',
          message: `Confirmez-vous la suppression du planning du ${this.dayLabels[schedule.dayOfWeek]} pour "${schedule.teamName}" ?`,
          danger: true,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.scheduleService.delete(schedule.id).subscribe({
            complete: () => {
              this.snackBar.open('Planning supprimé.', 'Fermer', { duration: 3000 });
              this.fetch();
            },
            error: () => this.snackBar.open('Impossible de supprimer ce planning.', 'Fermer', { duration: 4000 }),
          });
        }
      });
  }
}

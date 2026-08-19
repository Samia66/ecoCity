import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, map } from 'rxjs';

import { TeamService } from '../services/team.service';
import { Team } from '../models/team.model';
import { ZoneService } from '../../zones/services/zone.service';
import { Zone } from '../../zones/models/zone.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner/loading-spinner.component';

/** Une équipe peut couvrir plusieurs zones — checklist multi-sélection, même pattern que `TeamMembersDialogComponent`. */
@Component({
  selector: 'eco-team-zone-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    ButtonComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './team-zone-dialog.component.html',
  styleUrl: './team-zone-dialog.component.scss',
})
export class TeamZoneDialogComponent implements OnInit {
  private teamService = inject(TeamService);
  private zoneService = inject(ZoneService);
  private dialogRef = inject(MatDialogRef<TeamZoneDialogComponent>);

  loading = signal(true);
  saving = signal(false);
  errorMessage = signal('');
  zones = signal<Zone[]>([]);
  selectedZoneIds = signal<Set<string>>(new Set());

  private initialZoneIds = new Set<string>();
  readonly team: Team;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { team: Team }) {
    this.team = data.team;
  }

  ngOnInit(): void {
    this.zoneService.getAll().subscribe({
      next: (zones) => {
        this.zones.set(zones);
        const ids = new Set(this.team.zones.map((z) => z.id));
        this.initialZoneIds = new Set(ids);
        this.selectedZoneIds.set(new Set(ids));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Impossible de charger les zones disponibles.');
      },
    });
  }

  isSelected(zoneId: string): boolean {
    return this.selectedZoneIds().has(zoneId);
  }

  toggle(zoneId: string): void {
    const current = new Set(this.selectedZoneIds());
    current.has(zoneId) ? current.delete(zoneId) : current.add(zoneId);
    this.selectedZoneIds.set(current);
  }

  save(): void {
    const selected = this.selectedZoneIds();
    const toAdd = [...selected].filter((id) => !this.initialZoneIds.has(id));
    const toRemove = [...this.initialZoneIds].filter((id) => !selected.has(id));

    if (toAdd.length === 0 && toRemove.length === 0) {
      this.dialogRef.close(false);
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const requests = [
      ...toAdd.map((id) => this.teamService.addZone(this.team.id, id).pipe(map(() => undefined))),
      ...toRemove.map((id) => this.teamService.removeZone(this.team.id, id)),
    ];

    forkJoin(requests).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set("Une erreur est survenue lors de l'affectation des zones.");
      },
    });
  }
}

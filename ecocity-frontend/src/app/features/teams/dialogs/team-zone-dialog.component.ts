import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';

import { TeamService } from '../services/team.service';
import { Team } from '../models/team.model';
import { ZoneService } from '../../zones/services/zone.service';
import { Zone } from '../../zones/models/zone.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'eco-team-zone-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
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
  selectedZoneId: string | null;

  readonly team: Team;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { team: Team }) {
    this.team = data.team;
    this.selectedZoneId = data.team.zoneId ?? null;
  }

  ngOnInit(): void {
    this.zoneService.getAll().subscribe({
      next: (zones) => {
        this.zones.set(zones);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Impossible de charger les zones disponibles.');
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.errorMessage.set('');

    // `.pipe(map(() => undefined))` unifie les deux branches vers un seul
    // type `Observable<void>` — évite un conflit de surcharge `.subscribe()`
    // sur une union `Observable<Team> | Observable<void>`.
    const request$ = this.selectedZoneId
      ? this.teamService.assignZone(this.team.id, this.selectedZoneId).pipe(map(() => undefined))
      : this.teamService.unassignZone(this.team.id);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set("Une erreur est survenue lors de l'affectation de la zone.");
      },
    });
  }
}

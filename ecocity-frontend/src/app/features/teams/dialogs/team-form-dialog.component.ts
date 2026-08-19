import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { TeamService } from '../services/team.service';
import { Team, TEAM_MAX_MEMBERS } from '../models/team.model';
import { ZoneService } from '../../zones/services/zone.service';
import { Zone } from '../../zones/models/zone.model';
import { UserService } from '../../users/services/user.service';
import { UserItem } from '../../users/models/user.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner/loading-spinner.component';

/**
 * En création : nom + chef d'équipe + 1-2 agents + zones (le backend exige
 * `leaderId`/`agentIds` dès `POST /teams`). En édition : seuls nom/description/
 * statut sont modifiables ici — le chef, les membres et les zones ont leurs
 * propres dialogs dédiés (`TeamLeaderDialogComponent`, `TeamMembersDialogComponent`,
 * `TeamZoneDialogComponent`).
 */
@Component({
  selector: 'eco-team-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ButtonComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './team-form-dialog.component.html',
})
export class TeamFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private teamService = inject(TeamService);
  private userService = inject(UserService);
  private zoneService = inject(ZoneService);
  private dialogRef = inject(MatDialogRef<TeamFormDialogComponent>);

  readonly isEdit = !!this.data?.team;
  readonly maxAgents = TEAM_MAX_MEMBERS - 1;

  loading = signal(!this.isEdit);
  submitting = signal(false);
  errorMessage = signal('');
  leaders = signal<UserItem[]>([]);
  agents = signal<UserItem[]>([]);
  zones = signal<Zone[]>([]);

  form = this.fb.nonNullable.group({
    name: [this.data?.team?.name ?? '', Validators.required],
    description: [this.data?.team?.description ?? ''],
    status: [this.data?.team?.status ?? 'ACTIVE'],
    leaderId: ['', this.isEdit ? [] : [Validators.required]],
    agentIds: [[] as string[], this.isEdit ? [] : [Validators.required]],
    zoneIds: [[] as string[]],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { team?: Team }) {}

  ngOnInit(): void {
    if (this.isEdit) return;

    forkJoin({
      leaders: this.userService.getAll({ role: 'TEAM_LEADER', limit: 100 }),
      agents: this.userService.getAll({ role: 'AGENT', limit: 100 }),
      zones: this.zoneService.getAll(),
    }).subscribe({
      next: ({ leaders, agents, zones }) => {
        this.leaders.set(leaders.data);
        this.agents.set(agents.data);
        this.zones.set(zones);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Impossible de charger les chefs d’équipe, agents ou zones disponibles.');
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');
    const value = this.form.getRawValue();

    const request$ = this.isEdit
      ? this.teamService.update(this.data.team!.id, {
          name: value.name,
          description: value.description,
          status: value.status,
        })
      : this.teamService.create({
          name: value.name,
          description: value.description,
          status: value.status,
          leaderId: value.leaderId,
          agentIds: value.agentIds,
          zoneIds: value.zoneIds,
        });

    request$.subscribe({
      next: (team) => {
        this.submitting.set(false);
        this.dialogRef.close(team);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err?.error?.message ?? "Une erreur est survenue lors de l'enregistrement.");
      },
    });
  }
}

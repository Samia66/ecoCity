import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, map } from 'rxjs';

import { TeamService } from '../services/team.service';
import { Team, TEAM_MAX_MEMBERS, TEAM_MIN_MEMBERS } from '../models/team.model';
import { UserService } from '../../users/services/user.service';
import { UserItem } from '../../users/models/user.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'eco-team-members-dialog',
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
  templateUrl: './team-members-dialog.component.html',
  styleUrl: './team-members-dialog.component.scss',
})
export class TeamMembersDialogComponent implements OnInit {
  private teamService = inject(TeamService);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<TeamMembersDialogComponent>);

  readonly minMembers = TEAM_MIN_MEMBERS;
  readonly maxMembers = TEAM_MAX_MEMBERS;

  loading = signal(true);
  saving = signal(false);
  errorMessage = signal('');
  agents = signal<UserItem[]>([]);
  selectedAgentIds = signal<Set<string>>(new Set());

  private initialMemberIds = new Set<string>();
  private teamId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { team: Team }) {
    this.teamId = data.team.id;
  }

  ngOnInit(): void {
    forkJoin({
      agents: this.userService.getAll({ role: 'AGENT', limit: 100 }),
      members: this.teamService.getMembers(this.teamId),
    }).subscribe({
      next: ({ agents, members }) => {
        this.agents.set(agents.data);
        const ids = new Set(members.map((m) => m.id));
        this.initialMemberIds = new Set(ids);
        this.selectedAgentIds.set(new Set(ids));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Impossible de charger les agents disponibles.');
      },
    });
  }

  isSelected(agentId: string): boolean {
    return this.selectedAgentIds().has(agentId);
  }

  isDisabled(agentId: string): boolean {
    return !this.isSelected(agentId) && this.selectedAgentIds().size >= this.maxMembers;
  }

  toggle(agentId: string): void {
    const current = new Set(this.selectedAgentIds());

    if (current.has(agentId)) {
      current.delete(agentId);
    } else {
      if (current.size >= this.maxMembers) {
        this.errorMessage.set(`Une équipe ne peut pas dépasser ${this.maxMembers} agents.`);
        return;
      }
      current.add(agentId);
    }

    this.errorMessage.set('');
    this.selectedAgentIds.set(current);
  }

  save(): void {
    const selected = this.selectedAgentIds();

    if (selected.size < this.minMembers) {
      this.errorMessage.set(`Une équipe doit contenir entre ${this.minMembers} et ${this.maxMembers} agents.`);
      return;
    }
    if (selected.size > this.maxMembers) {
      this.errorMessage.set(`Une équipe ne peut pas dépasser ${this.maxMembers} agents.`);
      return;
    }

    const toAdd = [...selected].filter((id) => !this.initialMemberIds.has(id));
    const toRemove = [...this.initialMemberIds].filter((id) => !selected.has(id));

    if (toAdd.length === 0 && toRemove.length === 0) {
      this.dialogRef.close(false);
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const requests = [
      ...toAdd.map((id) => this.teamService.addMember(this.teamId, id).pipe(map(() => undefined))),
      ...toRemove.map((id) => this.teamService.removeMember(this.teamId, id)),
    ];

    forkJoin(requests).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set("Une erreur est survenue lors de l'enregistrement des membres.");
      },
    });
  }
}

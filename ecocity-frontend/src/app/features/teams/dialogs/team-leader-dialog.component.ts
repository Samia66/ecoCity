import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TeamService } from '../services/team.service';
import { Team } from '../models/team.model';
import { UserService } from '../../users/services/user.service';
import { UserItem } from '../../users/models/user.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'eco-team-leader-dialog',
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
  templateUrl: './team-leader-dialog.component.html',
})
export class TeamLeaderDialogComponent implements OnInit {
  private teamService = inject(TeamService);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<TeamLeaderDialogComponent>);

  loading = signal(true);
  saving = signal(false);
  errorMessage = signal('');
  leaders = signal<UserItem[]>([]);
  selectedLeaderId: string | null;

  readonly team: Team;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { team: Team }) {
    this.team = data.team;
    this.selectedLeaderId = data.team.leaderId ?? null;
  }

  ngOnInit(): void {
    this.userService.getAll({ role: 'TEAM_LEADER', limit: 100 }).subscribe({
      next: (res) => {
        this.leaders.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Impossible de charger les chefs d’équipe disponibles.');
      },
    });
  }

  save(): void {
    if (!this.selectedLeaderId) return;

    this.saving.set(true);
    this.errorMessage.set('');
    this.teamService.assignLeader(this.team.id, this.selectedLeaderId).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set("Une erreur est survenue lors de l'affectation du chef d'équipe.");
      },
    });
  }
}

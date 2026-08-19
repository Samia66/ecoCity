import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TeamService } from '../services/team.service';
import { Team } from '../models/team.model';
import { PageHeaderComponent } from '../../../core/layout/components/page-header/page-header.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { TeamCardComponent } from '../components/team-card.component';
import { TeamFormDialogComponent } from '../dialogs/team-form-dialog.component';
import { TeamMembersDialogComponent } from '../dialogs/team-members-dialog.component';
import { TeamZoneDialogComponent } from '../dialogs/team-zone-dialog.component';

@Component({
  selector: 'eco-team-list-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ButtonComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    TeamCardComponent,
  ],
  templateUrl: './team-list-page.component.html',
  styleUrl: './team-list-page.component.scss',
})
export class TeamListPageComponent implements OnInit {
  private teamService = inject(TeamService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  teams = signal<Team[]>([]);

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.teamService.getAll().subscribe({
      next: (teams) => {
        this.teams.set(teams);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Impossible de charger les équipes.', 'Fermer', { duration: 4000 });
      },
    });
  }

  openCreate(): void {
    this.dialog
      .open(TeamFormDialogComponent, { data: {} })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.snackBar.open('Équipe créée avec succès.', 'Fermer', { duration: 3000 });
          this.fetch();
        }
      });
  }

  openEdit(team: Team): void {
    this.dialog
      .open(TeamFormDialogComponent, { data: { team } })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.snackBar.open('Équipe mise à jour avec succès.', 'Fermer', { duration: 3000 });
          this.fetch();
        }
      });
  }

  openMembers(team: Team): void {
    this.dialog
      .open(TeamMembersDialogComponent, { data: { team } })
      .afterClosed()
      .subscribe((changed) => {
        if (changed) {
          this.snackBar.open('Membres de l\u2019équipe mis à jour.', 'Fermer', { duration: 3000 });
          this.fetch();
        }
      });
  }

  openZone(team: Team): void {
    this.dialog
      .open(TeamZoneDialogComponent, { data: { team } })
      .afterClosed()
      .subscribe((changed) => {
        if (changed) {
          this.snackBar.open('Zone affectée avec succès.', 'Fermer', { duration: 3000 });
          this.fetch();
        }
      });
  }

  remove(team: Team): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: "Supprimer l'équipe",
          message: `Confirmez-vous la suppression de l'équipe "${team.name}" ?`,
          danger: true,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.teamService.delete(team.id).subscribe({
            complete: () => {
              this.snackBar.open('Équipe supprimée.', 'Fermer', { duration: 3000 });
              this.fetch();
            },
            error: () => {
              this.snackBar.open('Impossible de supprimer cette équipe.', 'Fermer', { duration: 4000 });
            },
          });
        }
      });
  }
}

import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { TeamService } from '../services/team.service';
import { Team } from '../models/team.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'eco-team-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ButtonComponent,
  ],
  templateUrl: './team-form-dialog.component.html',
})
export class TeamFormDialogComponent {
  private fb = inject(FormBuilder);
  private teamService = inject(TeamService);
  private dialogRef = inject(MatDialogRef<TeamFormDialogComponent>);

  submitting = signal(false);
  readonly isEdit = !!this.data?.team;

  form = this.fb.nonNullable.group({
    name: [this.data?.team?.name ?? '', Validators.required],
    description: [this.data?.team?.description ?? ''],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { team?: Team }) {}

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const payload = this.form.getRawValue();
    const request$ = this.isEdit
      ? this.teamService.update(this.data.team!.id, payload)
      : this.teamService.create(payload);

    request$.subscribe({
      next: (team) => {
        this.submitting.set(false);
        this.dialogRef.close(team);
      },
      error: () => this.submitting.set(false),
    });
  }
}

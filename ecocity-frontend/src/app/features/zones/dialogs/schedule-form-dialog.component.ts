import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { CollectionScheduleService } from '../services/collection-schedule.service';
import { CollectionSchedule } from '../models/collection-schedule.model';
import { DAY_LABELS, DAYS_OF_WEEK, TeamZoneRef } from '../../teams/models/team.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'eco-schedule-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    ButtonComponent,
  ],
  templateUrl: './schedule-form-dialog.component.html',
})
export class ScheduleFormDialogComponent {
  private fb = inject(FormBuilder);
  private scheduleService = inject(CollectionScheduleService);
  private dialogRef = inject(MatDialogRef<ScheduleFormDialogComponent>);

  readonly days = DAYS_OF_WEEK;
  readonly dayLabels = DAY_LABELS;
  readonly zoneTeams: TeamZoneRef[];
  readonly isEdit = !!this.data?.schedule;

  submitting = signal(false);

  form = this.fb.nonNullable.group({
    teamId: [this.data?.schedule?.teamId ?? this.data?.zoneTeams?.[0]?.id ?? '', Validators.required],
    dayOfWeek: [this.data?.schedule?.dayOfWeek ?? 'LUNDI', Validators.required],
    startTime: [this.data?.schedule?.startTime ?? ''],
    endTime: [this.data?.schedule?.endTime ?? ''],
    isActive: [this.data?.schedule?.isActive ?? true],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { zoneId: string; zoneTeams: TeamZoneRef[]; schedule?: CollectionSchedule },
  ) {
    this.zoneTeams = data.zoneTeams;
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
    const value = this.form.getRawValue();
    const request$ = this.isEdit
      ? this.scheduleService.update(this.data.schedule!.id, value)
      : this.scheduleService.create(this.data.zoneId, value);

    request$.subscribe({
      next: (schedule) => {
        this.submitting.set(false);
        this.dialogRef.close(schedule);
      },
      error: () => this.submitting.set(false),
    });
  }
}

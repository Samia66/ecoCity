import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ZoneService } from '../services/zone.service';
import { Zone } from '../models/zone.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'eco-zone-form-dialog',
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
  templateUrl: './zone-form-dialog.component.html',
})
export class ZoneFormDialogComponent {
  private fb = inject(FormBuilder);
  private zoneService = inject(ZoneService);
  private dialogRef = inject(MatDialogRef<ZoneFormDialogComponent>);

  submitting = signal(false);
  readonly isEdit = !!this.data?.zone;

  form = this.fb.nonNullable.group({
    name: [this.data?.zone?.name ?? '', Validators.required],
    description: [this.data?.zone?.description ?? ''],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { zone?: Zone }) {}

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
      ? this.zoneService.update(this.data.zone!.id, payload)
      : this.zoneService.create(payload);

    request$.subscribe({
      next: (zone) => {
        this.submitting.set(false);
        this.dialogRef.close(zone);
      },
      error: () => this.submitting.set(false),
    });
  }
}

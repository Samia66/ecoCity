import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { OrganizationService } from '../../services/organization.service';
import { Organization } from '../../models/organization.model';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'eco-organization-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ButtonComponent],
  templateUrl: './organization-form.component.html',
})
export class OrganizationFormComponent {
  private fb = inject(FormBuilder);
  private organizationService = inject(OrganizationService);
  private dialogRef = inject(MatDialogRef<OrganizationFormComponent>);

  submitting = signal(false);
  readonly isEdit = !!this.data?.organization;

  form = this.fb.nonNullable.group({
    name: [this.data?.organization?.name ?? '', Validators.required],
    city: [this.data?.organization?.city ?? '', Validators.required],
    address: [this.data?.organization?.address ?? '', Validators.required],
    phone: [this.data?.organization?.phone ?? '', Validators.required],
    email: [this.data?.organization?.email ?? '', [Validators.required, Validators.email]],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { organization?: Organization }) {}

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    const payload = this.form.getRawValue();
    const request$ = this.isEdit
      ? this.organizationService.update(this.data.organization!.id, payload)
      : this.organizationService.create(payload);

    request$.subscribe({
      next: (org) => { this.submitting.set(false); this.dialogRef.close(org); },
      error: () => this.submitting.set(false),
    });
  }
}

import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { UserService } from '../../services/user.service';
import { UserItem } from '../../models/user.model';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { ROLE_LABELS } from '../../../../core/constants/app.constants';

@Component({
  selector: 'eco-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ButtonComponent],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<UserFormComponent>);

  submitting = signal(false);
  readonly roles = Object.entries(ROLE_LABELS);
  readonly isEdit = !!this.data?.user;

  form = this.fb.nonNullable.group({
    firstName: [this.data?.user?.firstName ?? '', Validators.required],
    lastName: [this.data?.user?.lastName ?? '', Validators.required],
    email: [this.data?.user?.email ?? '', [Validators.required, Validators.email]],
    role: [this.data?.user?.role ?? 'AGENT', Validators.required],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user?: UserItem }) {}

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);
    const payload = this.form.getRawValue();
    const request$ = this.isEdit
      ? this.userService.update(this.data.user!.id, payload)
      : this.userService.create(payload);

    request$.subscribe({
      next: (user) => { this.submitting.set(false); this.dialogRef.close(user); },
      error: () => this.submitting.set(false),
    });
  }
}

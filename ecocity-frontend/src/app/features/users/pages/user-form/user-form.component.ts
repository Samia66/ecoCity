import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '../../services/user.service';
import { UserItem } from '../../models/user.model';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { ROLE_LABELS } from '../../../../core/constants/app.constants';

/** Rôles créables par un supérieur hiérarchique via ce formulaire (le citoyen s'inscrit lui-même). */
const CREATABLE_ROLES = ['ADMIN', 'TEAM_LEADER', 'AGENT'] as const;

@Component({
  selector: 'eco-user-form',
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
    MatTooltipModule,
    ButtonComponent,
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<UserFormComponent>);
  private snackBar = inject(MatSnackBar);

  submitting = signal(false);
  temporaryPassword = signal<string | null>(null);
  readonly isEdit = !!this.data?.user;
  readonly roles = Object.entries(ROLE_LABELS).filter(([code]) =>
    (CREATABLE_ROLES as readonly string[]).includes(code),
  );

  form = this.fb.nonNullable.group({
    firstName: [this.data?.user?.firstName ?? '', Validators.required],
    lastName: [this.data?.user?.lastName ?? '', Validators.required],
    email: [this.data?.user?.email ?? '', [Validators.required, Validators.email]],
    role: [{ value: this.data?.user?.role ?? 'AGENT', disabled: this.isEdit }, Validators.required],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user?: UserItem }) {}

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);

    if (this.isEdit) {
      const { firstName, lastName } = this.form.getRawValue();
      this.userService.update(this.data.user!.id, { firstName, lastName }).subscribe({
        next: (user) => { this.submitting.set(false); this.dialogRef.close(user); },
        error: () => this.submitting.set(false),
      });
      return;
    }

    const payload = this.form.getRawValue();
    this.userService.create(payload).subscribe({
      next: (result) => {
        this.submitting.set(false);
        // On garde le dialogue ouvert pour afficher le mot de passe temporaire une seule fois.
        this.temporaryPassword.set(result.temporaryPassword);
      },
      error: () => this.submitting.set(false),
    });
  }

  copyPassword(): void {
    const password = this.temporaryPassword();
    if (!password) return;
    navigator.clipboard?.writeText(password);
    this.snackBar.open('Mot de passe copié dans le presse-papiers', 'Fermer', { duration: 2500 });
  }

  finish(): void {
    this.dialogRef.close(true);
  }
}

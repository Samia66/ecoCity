import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { PasswordInputComponent } from '../../../../shared/ui/password-input/password-input.component';

@Component({
  selector: 'eco-settings-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, CardComponent, ButtonComponent, PasswordInputComponent],
  templateUrl: './security.component.html',
  styleUrl: '../profile/profile.component.scss',
})
export class SecurityComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  saving = signal(false);

  form = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  get f() { return this.form.controls; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { newPassword, confirmPassword } = this.form.getRawValue();
    if (newPassword !== confirmPassword) {
      this.snackBar.open('Les mots de passe ne correspondent pas', 'Fermer', { duration: 3000 });
      return;
    }
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.form.reset();
      this.snackBar.open('Mot de passe mis à jour avec succès', 'Fermer', { duration: 3000 });
    }, 400);
  }
}

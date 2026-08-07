import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthStore } from '../../../../core/store/auth.store';
import { AuthService } from '../../../../core/services/auth.service';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'eco-settings-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, PageHeaderComponent, CardComponent, ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  saving = signal(false);
  readonly user = this.authStore.currentUser;
  readonly initials = () => (this.user()?.firstName?.charAt(0) ?? '') + (this.user()?.lastName?.charAt(0) ?? '');

  form = this.fb.nonNullable.group({
    firstName: [this.user()?.firstName ?? '', Validators.required],
    lastName: [this.user()?.lastName ?? '', Validators.required],
    email: [{ value: this.user()?.email ?? '', disabled: true }],
  });

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const current = this.user();
    if (current) {
      this.authStore.updateUser({ ...current, ...this.form.getRawValue() });
    }
    setTimeout(() => {
      this.saving.set(false);
      this.snackBar.open('Profil mis à jour avec succès', 'Fermer', { duration: 3000 });
    }, 400);
  }
}

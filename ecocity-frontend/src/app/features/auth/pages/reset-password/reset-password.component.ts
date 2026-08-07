import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { PasswordInputComponent } from '../../../../shared/ui/password-input/password-input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'eco-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule, PasswordInputComponent, ButtonComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: '../forgot-password/forgot-password.component.scss',
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(false);
  backendError = signal('');
  private token = this.route.snapshot.queryParamMap.get('token') ?? '';

  form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  get f() { return this.form.controls; }

  submit(): void {
    this.backendError.set('');
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const { password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.backendError.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.loading.set(true);
    this.authService.resetPassword({ token: this.token, password }).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/login']); },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.backendError.set(err.error?.message || 'Lien invalide ou expiré.');
      },
    });
  }
}

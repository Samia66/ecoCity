import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'eco-password-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PasswordInputComponent), multi: true },
  ],
  template: `
    <mat-form-field appearance="outline" class="eco-form-field">
      @if (label) { <mat-label>{{ label }}</mat-label> }
      <mat-icon matPrefix>lock</mat-icon>
      <input
        matInput
        [type]="visible() ? 'text' : 'password'"
        [placeholder]="placeholder"
        [(ngModel)]="value"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
        [disabled]="disabled"
      />
      <button mat-icon-button matSuffix type="button" (click)="visible.set(!visible())">
        <mat-icon>{{ visible() ? 'visibility_off' : 'visibility' }}</mat-icon>
      </button>
      @if (errorMessage) { <mat-error>{{ errorMessage }}</mat-error> }
    </mat-form-field>
  `,
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() label = 'Mot de passe';
  @Input() placeholder = '••••••••';
  @Input() errorMessage = '';

  value = '';
  disabled = false;
  visible = signal(false);

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

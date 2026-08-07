import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type EcoButtonVariant = 'flat' | 'outlined' | 'stroked' | 'text';
export type EcoButtonColor = 'primary' | 'accent' | 'warn';

@Component({
  selector: 'eco-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    @switch (variant) {
      @case ('outlined') {
        <button mat-stroked-button [color]="color" [disabled]="disabled || loading" [class.eco-btn--block]="block" class="eco-btn" [type]="type">
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </button>
      }
      @case ('text') {
        <button mat-button [color]="color" [disabled]="disabled || loading" [class.eco-btn--block]="block" class="eco-btn" [type]="type">
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </button>
      }
      @default {
        <button mat-flat-button [color]="color" [disabled]="disabled || loading" [class.eco-btn--block]="block" class="eco-btn" [type]="type">
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </button>
      }
    }

    <ng-template #content>
      @if (loading) {
        <mat-spinner diameter="18" style="display:inline-block;vertical-align:middle;margin-right:8px;"></mat-spinner>
      } @else if (icon) {
        <mat-icon>{{ icon }}</mat-icon>
      }
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class ButtonComponent {
  @Input() variant: EcoButtonVariant = 'flat';
  @Input() color: EcoButtonColor = 'primary';
  @Input() icon = '';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() block = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}

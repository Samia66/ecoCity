import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'eco-empty-state',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="eco-empty">
      <div class="eco-empty__icon"><mat-icon>{{ icon }}</mat-icon></div>
      <h3 class="eco-empty__title">{{ title }}</h3>
      @if (description) { <p class="eco-empty__description">{{ description }}</p> }
      @if (actionLabel) {
        <button mat-flat-button color="primary" class="eco-btn" (click)="action.emit()">
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .eco-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 56px 24px; }
    .eco-empty__icon { width: 64px; height: 64px; border-radius: 50%; background: #F8FAFC; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: #94A3B8; }
    .eco-empty__icon mat-icon { font-size: 30px; width: 30px; height: 30px; }
    .eco-empty__title { font-size: 15px; font-weight: 600; color: #0F172A; }
    .eco-empty__description { font-size: 13px; color: #64748B; margin-top: 4px; max-width: 340px; }
    button { margin-top: 20px; }
  `],
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'Aucune donnée';
  @Input() description = '';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}

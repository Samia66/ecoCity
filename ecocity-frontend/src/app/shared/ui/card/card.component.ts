import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="eco-card" [class.eco-card--hover]="hoverable" [style.padding.px]="padding">
      @if (title) {
        <div class="eco-ui-card__header">
          <h3>{{ title }}</h3>
          @if (subtitle) { <p>{{ subtitle }}</p> }
        </div>
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .eco-ui-card__header { margin-bottom: 16px; }
    .eco-ui-card__header h3 { font-size: 15px; font-weight: 600; }
    .eco-ui-card__header p { font-size: 12px; color: #64748B; margin-top: 2px; }
  `],
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() hoverable = false;
  @Input() padding = 24;
}

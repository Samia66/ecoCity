import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'eco-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="eco-loading" [style.padding.px]="inline ? 0 : 48">
      <mat-spinner [diameter]="diameter"></mat-spinner>
      @if (label) { <p class="eco-loading__label">{{ label }}</p> }
    </div>
  `,
  styles: [`
    .eco-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
    .eco-loading__label { font-size: 13px; color: #64748B; }
  `],
})
export class LoadingSpinnerComponent {
  @Input() diameter = 40;
  @Input() label = '';
  @Input() inline = false;
}

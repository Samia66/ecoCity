import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type StatsCardColor = 'primary' | 'secondary' | 'warning' | 'success' | 'danger';

@Component({
  selector: 'eco-stats-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss',
})
export class StatsCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: number | string;
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) color!: StatsCardColor;
  @Input() trend = '';
  @Input() trendUp = true;
}

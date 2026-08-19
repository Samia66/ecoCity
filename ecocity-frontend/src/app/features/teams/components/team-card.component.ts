import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Team } from '../models/team.model';

@Component({
  selector: 'eco-team-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MatChipsModule, MatTooltipModule],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
})
export class TeamCardComponent {
  @Input({ required: true }) team!: Team;
  @Input() canManage = false;

  @Output() manageMembers = new EventEmitter<Team>();
  @Output() assignZone = new EventEmitter<Team>();
  @Output() assignLeader = new EventEmitter<Team>();
  @Output() edit = new EventEmitter<Team>();
  @Output() remove = new EventEmitter<Team>();
}

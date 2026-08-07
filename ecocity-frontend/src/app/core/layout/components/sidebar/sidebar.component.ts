import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NavItem } from '../../models/nav-item.model';
import { TokenService } from '../../../../core/services/token.service';

export const NAV_ITEMS: NavItem[] = [

  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    roles: ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'CITIZEN'],
  },

  {
    label: 'Signalements',
    icon: 'report_problem',
    route: '/reports',
    roles: ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'CITIZEN'],
  },

  {
    label: 'Interventions',
    icon: 'engineering',
    route: '/interventions',
    roles: ['SUPER_ADMIN', 'ADMIN', 'AGENT'],
  },

  {
    label: 'Utilisateurs',
    icon: 'groups',
    route: '/users',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },

  {
    label: 'Organisations',
    icon: 'apartment',
    route: '/organizations',
    roles: ['SUPER_ADMIN'],
  },

  {
    label: 'Catégories',
    icon: 'category',
    route: '/categories',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },

  {
    label: 'Rôles',
    icon: 'admin_panel_settings',
    route: '/roles',
    roles: ['SUPER_ADMIN'],
  },

  {
    label: 'Permissions',
    icon: 'lock_person',
    route: '/permissions',
    roles: ['SUPER_ADMIN'],
  },

  {
    label: 'Paramètres',
    icon: 'settings',
    route: '/settings',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },

];

@Component({
  selector: 'eco-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  private tokenService = inject(TokenService);

  @Input() collapsed = false;

  @Input() mobileOpen = false;

  @Output() closeMobile =
    new EventEmitter<void>();

  readonly navItems = computed(() => {

    const role =
      this.tokenService
        .getCurrentUser()
        ?.role ?? 'CITIZEN';

    return NAV_ITEMS.filter(item =>
      item.roles.includes(role),
    );

  });

}
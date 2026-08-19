import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NavItem } from '../../models/nav-item.model';
import { AuthStore } from '../../../../core/store/auth.store';

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    permission: 'dashboard.view_organization',
  },
  {
    label: 'Signalements',
    icon: 'report_problem',
    route: '/reports',
    permission: 'reports.view',
  },
  {
    label: 'Interventions',
    icon: 'engineering',
    route: '/interventions',
    permission: 'interventions.view',
  },
  {
    label: 'Utilisateurs',
    icon: 'groups',
    route: '/users',
    permission: 'users.view',
  },
  {
    label: 'Organisations',
    icon: 'apartment',
    route: '/organizations',
    permission: 'organizations.view',
  },
  {
    label: 'Catégories',
    icon: 'category',
    route: '/categories',
    permission: 'categories.manage',
  },
  {
    label: 'Équipes',
    icon: 'groups',
    route: '/teams',
    permission: 'teams.manage',
  },
  {
    label: 'Zones',
    icon: 'map',
    route: '/zones',
    permission: 'zones.manage',
  },
  {
    label: 'Rôles',
    icon: 'admin_panel_settings',
    route: '/roles',
    permission: 'roles.manage',
  },
  {
    label: 'Paramètres',
    icon: 'settings',
    route: '/settings',
    permission: 'settings.manage',
  },
];

@Component({
  selector: 'eco-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private authStore = inject(AuthStore);

  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() closeMobile = new EventEmitter<void>();

  readonly navItems = computed(() =>
    NAV_ITEMS.filter(
      (item) =>
        !item.permission || this.authStore.hasPermission(item.permission),
    ),
  );
}
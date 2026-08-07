import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'eco-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
  collapsed = signal(false);
  mobileOpen = signal(false);

  toggleSidebar(): void {
    this.collapsed.update((v) => !v);
  }

  toggleMobileSidebar(): void {
    this.mobileOpen.update((v) => !v);
  }
}

import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../../store/auth.store';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'eco-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatMenuModule, MatBadgeModule, MatButtonModule, MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleMobileSidebar = new EventEmitter<void>();

  private authStore = inject(AuthStore);
  private authService = inject(AuthService);
  private router = inject(Router);

  darkMode = false;
  searchTerm = '';

  readonly user = this.authStore.currentUser;
  readonly fullName = this.authStore.fullName;

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('eco-dark', this.darkMode);
  }

  logout(): void {
    this.authService.logout().subscribe({
      complete: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    this.authService.localLogout();
    this.router.navigate(['/login']);
  }
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';

import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';

@Component({
  selector: 'eco-settings-preferences',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSlideToggleModule, PageHeaderComponent, CardComponent],
  templateUrl: './preferences.component.html',
  styleUrl: '../profile/profile.component.scss',
})
export class PreferencesComponent {
  private snackBar = inject(MatSnackBar);

  darkMode = signal(false);
  emailNotifications = signal(true);
  pushNotifications = signal(true);
  weeklyReport = signal(false);

  toggleDarkMode(): void {
    this.darkMode.update((v) => !v);
    document.body.classList.toggle('eco-dark', this.darkMode());
  }

  notify(): void {
    this.snackBar.open('Préférences enregistrées', 'Fermer', { duration: 2000 });
  }
}

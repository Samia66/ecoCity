import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CollectionService } from '../../services/collection.service';
import { Collection } from '../../models/collection.model';
import { DAY_LABELS } from '../../../teams/models/team.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { AuthStore } from '../../../../core/store/auth.store';

@Component({
  selector: 'eco-collection-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeaderComponent,
    CardComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './collection-detail.component.html',
  styleUrls: ['../../../reports/pages/report-detail/report-detail.component.scss', './collection-detail.component.scss'],
})
export class CollectionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private collectionService = inject(CollectionService);
  private snackBar = inject(MatSnackBar);
  private authStore = inject(AuthStore);

  readonly dayLabels = DAY_LABELS;

  loading = signal(true);
  acting = signal(false);
  collection = signal<Collection | null>(null);
  problemDescription = '';

  canManage = computed(() => this.authStore.hasPermission('collections.manage'));

  ngOnInit(): void {
    this.fetch();
  }

  private fetch(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loading.set(true);
    this.collectionService.getById(id).subscribe({
      next: (c) => {
        this.collection.set(c);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  start(): void {
    const collection = this.collection();
    if (!collection) return;
    this.acting.set(true);
    this.collectionService.start(collection.id).subscribe({
      next: (updated) => {
        this.collection.set(updated);
        this.acting.set(false);
      },
      error: () => {
        this.acting.set(false);
        this.snackBar.open('Impossible de démarrer cette collecte.', 'Fermer', { duration: 4000 });
      },
    });
  }

  complete(): void {
    const collection = this.collection();
    if (!collection) return;
    this.acting.set(true);
    this.collectionService.complete(collection.id).subscribe({
      next: (updated) => {
        this.collection.set(updated);
        this.acting.set(false);
        this.snackBar.open('Collecte terminée.', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.acting.set(false);
        this.snackBar.open('Impossible de terminer cette collecte.', 'Fermer', { duration: 4000 });
      },
    });
  }

  reportProblem(): void {
    const collection = this.collection();
    if (!collection || !this.problemDescription.trim()) return;
    this.acting.set(true);
    this.collectionService.reportProblem(collection.id, this.problemDescription.trim()).subscribe({
      next: (updated) => {
        this.collection.set(updated);
        this.problemDescription = '';
        this.acting.set(false);
        this.snackBar.open('Problème signalé.', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.acting.set(false);
        this.snackBar.open("Impossible de signaler le problème.", 'Fermer', { duration: 4000 });
      },
    });
  }
}

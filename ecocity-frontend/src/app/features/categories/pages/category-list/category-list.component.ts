import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { CategoryFormComponent } from './category-form.component';

@Component({
  selector: 'eco-category-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, PageHeaderComponent, CardComponent, ButtonComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);

  loading = signal(true);
  categories = signal<Category[]>([]);

  private readonly MOCK: Category[] = [
    { id: 'c1', name: 'Dépôts sauvages de déchets', icon: 'delete', reportsCount: 312, createdAt: '2025-10-01' },
    { id: 'c2', name: 'Poubelles débordantes', icon: 'delete_sweep', reportsCount: 156, createdAt: '2025-10-01' },
    { id: 'c3', name: 'Éclairage public défectueux', icon: 'lightbulb', reportsCount: 245, createdAt: '2025-10-01' },
    { id: 'c4', name: 'Nids-de-poule', icon: 'construction', reportsCount: 198, createdAt: '2025-10-01' },
    { id: 'c5', name: 'Voirie endommagée', icon: 'road', reportsCount: 87, createdAt: '2025-10-01' },
    { id: 'c6', name: 'Caniveaux bouchés', icon: 'water_damage', reportsCount: 74, createdAt: '2025-10-01' },
    { id: 'c7', name: "Fuites d'eau", icon: 'water_drop', reportsCount: 143, createdAt: '2025-10-01' },
    { id: 'c8', name: 'Pollution', icon: 'smoke_free', reportsCount: 61, createdAt: '2025-10-01' },
    { id: 'c9', name: 'Espaces verts dégradés', icon: 'park', reportsCount: 121, createdAt: '2025-10-01' },
    { id: 'c10', name: 'Autres problèmes urbains', icon: 'more_horiz', reportsCount: 33, createdAt: '2025-10-01' },
  ];

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);

    this.categoryService.getAll().subscribe({
      next: (res: any) => {
        this.categories.set(res.data.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.categories.set(this.MOCK);
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.dialog.open(CategoryFormComponent, { data: {} }).afterClosed().subscribe((res) => { if (res) this.fetch(); });
  }

  openEdit(category: Category): void {
    this.dialog.open(CategoryFormComponent, { data: { category } }).afterClosed().subscribe((res) => { if (res) this.fetch(); });
  }

  remove(category: Category): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Supprimer la catégorie', message: `Confirmez-vous la suppression de "${category.name}" ?`, danger: true },
    }).afterClosed().subscribe((confirmed) => { if (confirmed) this.categoryService.delete(category.id).subscribe({ complete: () => this.fetch() }); });
  }
}

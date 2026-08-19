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



  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: (data) => { this.categories.set(data); this.loading.set(false); },
      error: () => {  this.loading.set(false); },
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

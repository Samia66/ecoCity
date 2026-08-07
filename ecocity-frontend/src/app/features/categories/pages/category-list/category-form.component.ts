import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'eco-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ButtonComponent],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="eco-dialog-form">
        <mat-form-field appearance="outline" class="eco-form-field">
          <mat-label>Nom de la catégorie</mat-label>
          <input matInput formControlName="name" placeholder="Ex : Nids-de-poule" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="eco-form-field">
          <mat-label>Icône Material (nom)</mat-label>
          <input matInput formControlName="icon" placeholder="Ex : construction" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Annuler</button>
      <eco-button [loading]="submitting()" (click)="submit()">{{ isEdit ? 'Enregistrer' : 'Créer' }}</eco-button>
    </mat-dialog-actions>
  `,
})
export class CategoryFormComponent {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef<CategoryFormComponent>);

  submitting = signal(false);
  readonly isEdit = !!this.data?.category;

  form = this.fb.nonNullable.group({
    name: [this.data?.category?.name ?? '', Validators.required],
    icon: [this.data?.category?.icon ?? 'category', Validators.required],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { category?: Category }) {}

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    const payload = this.form.getRawValue();
    const request$ = this.isEdit
      ? this.categoryService.update(this.data.category!.id, payload)
      : this.categoryService.create(payload);

    request$.subscribe({
      next: (cat) => { this.submitting.set(false); this.dialogRef.close(cat); },
      error: () => this.submitting.set(false),
    });
  }
}

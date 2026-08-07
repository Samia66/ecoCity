import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { ReportService } from '../../services/report.service';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { REPORT_TYPES } from '../../../../core/constants/app.constants';

@Component({
  selector: 'eco-report-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
  ],
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.scss',
})
export class ReportFormComponent {
  private fb = inject(FormBuilder);
  private reportService = inject(ReportService);
  private router = inject(Router);

  submitting = signal(false);
  selectedFiles = signal<File[]>([]);
  readonly categories = REPORT_TYPES;
  readonly priorities = ['BASSE', 'MOYENNE', 'HAUTE', 'CRITIQUE'];

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    priority: ['MOYENNE', Validators.required],
    address: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  get f() { return this.form.controls; }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles.set(Array.from(input.files));
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.update((files) => files.filter((_, i) => i !== index));
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);
    this.reportService.create(this.form.getRawValue() as any).subscribe({
      next: (report) => {
        this.submitting.set(false);
        this.router.navigate(['/reports', report.id]);
      },
      error: () => {
        this.submitting.set(false);
        this.router.navigate(['/reports']);
      },
    });
  }
}

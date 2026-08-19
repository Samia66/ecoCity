import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CollectionService } from '../../services/collection.service';
import { Collection } from '../../models/collection.model';
import { PageHeaderComponent } from '../../../../core/layout/components/page-header/page-header.component';
import { DataTableComponent } from '../../../../shared/ui/data-table/data-table.component';
import { EcoTableColumn } from '../../../../shared/ui/data-table/data-table.model';

@Component({
  selector: 'eco-collection-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './collection-list.component.html',
})
export class CollectionListComponent implements OnInit {
  private collectionService = inject(CollectionService);

  loading = signal(true);
  collections = signal<Collection[]>([]);

  columns: EcoTableColumn<Collection>[] = [
    { key: 'zoneName', label: 'Zone', sortable: true },
    { key: 'teamName', label: 'Équipe', sortable: true },
    { key: 'dayOfWeek', label: 'Jour', sortable: true },
    { key: 'statusLabel', label: 'Statut', sortable: true },
    { key: 'scheduledDate', label: 'Date', type: 'date', sortable: true },
  ];

  ngOnInit(): void {
    this.collectionService.getToday().subscribe({
      next: (res) => {
        this.collections.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}

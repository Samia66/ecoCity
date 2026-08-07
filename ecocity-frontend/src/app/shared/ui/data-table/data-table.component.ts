import { AfterViewInit, Component, ContentChild, Input, OnChanges, Output, EventEmitter, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EcoTableColumn } from './data-table.model';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'eco-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T extends Record<string, any> = any> implements OnChanges, AfterViewInit {
  @Input({ required: true }) columns: EcoTableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() loading = false;
  @Input() searchable = true;
  @Input() showActionsColumn = true;
  @Input() emptyTitle = 'Aucun résultat';
  @Input() emptyDescription = "Aucune donnée ne correspond à votre recherche pour l'instant.";
  @Input() pageSizeOptions = [10, 25, 50];
  @Input() pageSize = 10;

  @Output() rowClick = new EventEmitter<T>();

  @ContentChild('actionsTemplate') actionsTemplate?: TemplateRef<{ $implicit: T }>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<T>([]);
  searchTerm = '';

  get displayedColumns(): string[] {
    const keys = this.columns.map((c) => c.key);
    return this.showActionsColumn ? [...keys, 'actions'] : keys;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data ?? [];
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  cellValue(row: T, column: EcoTableColumn<T>): any {
    return column.accessor ? column.accessor(row) : row[column.key];
  }
}

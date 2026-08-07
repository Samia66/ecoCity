export type EcoColumnType = 'text' | 'badge-status' | 'badge-priority' | 'date' | 'custom';

export interface EcoTableColumn<T = any> {
  key: string;
  label: string;
  type?: EcoColumnType;
  sortable?: boolean;
  width?: string;
  accessor?: (row: T) => unknown;
}

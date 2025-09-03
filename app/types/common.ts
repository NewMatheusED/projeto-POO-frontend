// Tipos comuns utilizados em toda a aplicação
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'like' | 'in';
  value: any;
}

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sort?: SortConfig;
  filters?: FilterConfig[];
}

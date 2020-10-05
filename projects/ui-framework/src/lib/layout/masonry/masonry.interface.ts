export interface MasonryConfig {
  columns?: number;
  columnWidth?: number;
  gap?: number;
  rowDivision?: number;
}

export interface MasonryState {
  hostWidth?: number;
  columns?: number;
  childrenCount?: number;
  singleColumn?: boolean;
  config?: MasonryConfig;
}

export interface MasonryItemsChangedEvent {
  totalItems: number;
  updatedItems: HTMLElement[];
}

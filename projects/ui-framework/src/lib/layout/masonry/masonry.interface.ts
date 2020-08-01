export interface MasonryConfig {
  columns?: number;
  columnWidth?: number;
  gap?: number;
}

export interface MasonryState {
  hostWidth?: number;
  childrenCount?: number;
  singleColumn?: boolean;
  config?: MasonryConfig;
}

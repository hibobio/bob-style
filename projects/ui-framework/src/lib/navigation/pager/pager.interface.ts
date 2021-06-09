export interface PagerConfig {
  sliceStep: number;
  sliceMax: number;
  sliceSize: number;
  showSliceSizeSelect?: boolean;
  resetToFirstPage?: boolean;
}

export interface PagerState {
  page: number;
  limit: number;
  offset: number;
}

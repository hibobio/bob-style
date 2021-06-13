export interface PagerConfig {
  sliceStep: number;
  sliceMax: number;
  sliceSize: number;
  showSliceSizeSelect?: boolean;
  resetOnSliceSizeChange?: boolean;
}

export interface PagerState<T = any> {
  currentPage: number;
  sliceSize: number;
  currentSlice: number[] | T[];
  offset: number;
}

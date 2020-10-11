import { MasonryConfig } from './masonry.interface';

export const MASONRY_GAP_DEF = 16;
export const MASONRY_COLS_DEF = 3;
export const MASONRY_ROW_DIVISION_DEF = 1;

export const MASONRY_CONFIG_DEF: MasonryConfig = {
  columns: MASONRY_COLS_DEF,
  gap: MASONRY_GAP_DEF,
  mutationObserverConfig: {
    characterData: true,
    childList: true,
    subtree: true,
    attributeFilter: ['src', 'data-loaded', 'data-updated'],
    mutations: 'processed',
    filterSelector: 'b-masonry-item, b-masonry-layout > *',
  },
  enableResizeObserverOnItems: false,
};

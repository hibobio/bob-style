import { EventEmitter } from '@angular/core';
import { MutationObservableConfig } from '../../services/utils/mutation-observable';

export interface MasonryConfig {
  columns?: number;
  columnWidth?: number;
  gap?: number;
  rowDivision?: number;
  mutationObserverConfig?: MutationObservableConfig;
  enableResizeObserverOnItems?: boolean;
}

export interface MasonryState {
  hostWidth?: number;
  columns?: number;
  itemsCount?: number;
  singleColumn?: boolean;
  config?: MasonryConfig;
}

export interface MasonryItemsChangedEvent extends MasonryState {
  updatedItems: HTMLElement[];
  host: HTMLElement;
}

export interface MasonryUpdateConfig {
  host: HTMLElement;
  config: MasonryConfig;
  state: MasonryState;
  emitter?: EventEmitter<MasonryItemsChangedEvent>;
  debug?: boolean;
}

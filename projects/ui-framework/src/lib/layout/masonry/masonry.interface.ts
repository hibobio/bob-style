import { EventEmitter } from '@angular/core';

export interface MasonryConfig {
  columns?: number;
  columnWidth?: number;
  gap?: number;
  rowDivision?: number;
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

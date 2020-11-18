import { EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmptyStateConfig } from '../../indicators/empty-state/empty-state.interface';
import { ListChange } from '../../lists/list-change/list-change';
import { SelectMode } from '../../lists/list.enum';
import {
  itemID,
  ListFooterActions,
  SelectGroupOption,
} from '../../lists/list.interface';
import { MultiListComponent } from '../../lists/multi-list/multi-list.component';

export interface MultiListAndSomething<T = any> {
  list: MultiListComponent;

  inputOptions$: Observable<SelectGroupOption[]>;
  inputValue$: Observable<itemID[]>;

  listOptions$: BehaviorSubject<SelectGroupOption[]>;
  listValue$: BehaviorSubject<itemID[]>;

  otherList$: BehaviorSubject<T[]>;

  optionsDefault: SelectGroupOption[];
  mode: SelectMode;
  listLabel: string;
  otherLabel: string;
  showSingleGroupHeader: boolean;
  startWithGroupsCollapsed: boolean;
  emptyState: EmptyStateConfig;
  listActions: ListFooterActions;
  min: number;
  max: number;

  selectChange: EventEmitter<ListChange>;
  changed: EventEmitter<itemID[]>;

  readonly listElHeight: number;
  readonly listID: string;
  readonly otherID: string;

  // 'other' list should call this method with removed/deselected item(s) id(s)
  unselectOptions(unselectedID: any | any[]): void;

  // components that extend base need to implement this mapper method
  optionsToOtherList(options: SelectGroupOption[], value: itemID[]): T[];
}

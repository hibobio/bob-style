import { SelectType } from '../list.enum';
import { ListFooterActions } from '../list.interface';
import { EventEmitter } from '@angular/core';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

export type itemID = string | number;

export interface TreeListComponentIO {
  list: TreeListOption[];
  value: itemID[];
  valueDefault: itemID[];
  viewFilter: ViewFilter;
  keyMap: TreeListKeyMap;
  itemsMap: TreeListItemMap;

  type: SelectType;
  valueSeparatorChar: string;
  listActions: ListFooterActions;
  maxHeightItems: number;
  startCollapsed: boolean;
  readonly: boolean;
  disabled: boolean;

  embedded?: boolean;
  focusOnInit?: boolean;
  tooltipType?: TruncateTooltipType;
  changed: EventEmitter<TreeListValue>;
  apply?: EventEmitter<void>;
  cancel?: EventEmitter<void>;
}

export interface TreeListOption {
  id?: itemID;
  name?: string;
  children?: TreeListOption[];
  [key: string]: any;
}

export interface TreeListKeyMap {
  id: string;
  name: string;
  children: string;
  [targetKey: string]: string;
}

export type TreeListItemMap = Map<itemID, TreeListItem>;

export interface TreeListItem {
  id: itemID;
  name: string;
  value?: string;
  canBeDeleted?: boolean;

  // state
  collapsed?: boolean;
  selected?: boolean;
  parentSelected?: boolean;
  disabled?: boolean;
  deleted?: boolean;
  moved?: boolean;
  newitem?: boolean;
  hidden?: boolean;

  parentIDs?: itemID[] | null;
  childrenIDs?: itemID[] | null;
  selectedIDs?: Set<itemID> | null;

  // stats
  parentCount?: number;
  childrenCount?: number;
  groupsCount?: number;
  selectedCount?: number;

  // context
  allOptionsHidden?: boolean;
  nextInViewIsGroup?: boolean;
  originalIndex?: number;

  [key: string]: any;
}

export interface TreeListValue {
  selectedIDs: itemID[];
  selectedValues: string[];
}

export interface ViewFilterOptions {
  id?: itemID[];
  prop?: { key: string; value: any } | { key: string; value: any }[];
  search?: string | RegExp;
  searchBy?: 'name' | 'value';
}

export interface ViewFilter {
  show?: ViewFilterOptions;
  hide?: ViewFilterOptions;
}

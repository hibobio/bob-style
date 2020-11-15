import { RenderedComponent } from '../services/component-renderer/component-renderer.interface';

export interface ListHeader {
  groupName: string;
  groupIndex?: number;
  key?: string | number;
  isCollapsed: boolean;
  placeHolderSize: number;
  selected?: boolean;
  indeterminate?: boolean;
  selectedCount?: number;
  hidden?: boolean;
  groupIsOption?: boolean;
  hasCheckbox?: boolean;
}

export interface ListOption {
  isPlaceHolder: boolean;
  groupName: string;
  groupIndex: number;
  key?: string | number;
  value: string;
  id: number | string;
  selected: boolean;
  prefixComponent?: ListComponentPrefix | RenderedComponent;
  disabled?: boolean;
  hidden?: boolean;
  exclusive?: boolean;
  [key: string]: any;
}

export interface SelectGroupOption {
  groupName: string;
  groupIndex?: number;
  key?: string | number;
  options: SelectOption[];
  description?: string;
  selected?: boolean;
  hidden?: boolean;
  groupSelectedIDs?: (number | string)[];
  groupSelectedValues?: string[];
  selectedCount?: number;
  [key: string]: any;
}

export interface SelectOption {
  id: number | string;
  value: string;
  selected?: boolean;
  prefixComponent?: ListComponentPrefix | RenderedComponent;
  disabled?: boolean;
  hidden?: boolean;
  description?: string;
  canBeDeleted?: boolean;
  [key: string]: any;
}

export interface ListComponentPrefix {
  component: any;
  attributes: any;
}

export interface ListFooterActions {
  apply?: boolean | string;
  cancel?: boolean | string;
  clear?: boolean | string;
  reset?: boolean | string;
}

export interface ActionsButtonState {
  disabled?: boolean;
  hidden?: boolean;
}

export interface ListFooterActionsState {
  apply?: ActionsButtonState;
  cancel?: ActionsButtonState;
  clear?: ActionsButtonState;
  reset?: ActionsButtonState;
}

export interface UpdateListsConfig {
  collapseHeaders?: boolean;
  updateListHeaders?: boolean;
  updateListOptions?: boolean;
  updateListMinHeight?: boolean;
  selectedIDs?: (string | number)[];
  isSearching?: boolean;
}

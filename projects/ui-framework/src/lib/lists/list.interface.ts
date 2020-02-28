import { RenderedComponent } from '../services/component-renderer/component-renderer.interface';

export interface ListHeader {
  groupName: string;
  key?: string | number;
  isCollapsed: boolean;
  placeHolderSize: number;
  selected?: boolean;
  indeterminate?: boolean;
  selectedCount?: number;
  hidden?: boolean;
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
  [key: string]: any;
}

export interface SelectGroupOption {
  groupName: string;
  key?: string | number;
  options: SelectOption[];
  selected?: boolean;
  hidden?: boolean;
  [key: string]: any;
}

export interface SelectOption {
  value: string;
  id: number | string;
  selected?: boolean;
  prefixComponent?: ListComponentPrefix | RenderedComponent;
  disabled?: boolean;
  hidden?: boolean;
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
  selectedIDs?: (string | number)[];
}

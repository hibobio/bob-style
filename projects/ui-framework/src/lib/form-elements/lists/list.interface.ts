export interface ListHeader {
  groupName: string;
  isCollapsed: boolean;
  placeHolderSize: number;
  selected: boolean;
  indeterminate?: boolean;
}

export interface ListOption {
  isPlaceHolder: boolean;
  groupName: string;
  value: string;
  id: number | string;
  selected: boolean;
  prefixComponent?: ListComponentPrefix;
  disabled?: boolean;
}

export interface SelectGroupOption {
  groupName: string;
  key?: string;
  options: SelectOption[];
}

export interface SelectOption {
  value: string;
  id: number | string;
  selected: boolean;
  prefixComponent?: ListComponentPrefix;
  disabled?: boolean;
}

export interface ListComponentPrefix {
  component: any;
  attributes: any;
}

export interface ListFooterActions {
  clear?: boolean;
  cancel?: boolean;
  apply?: boolean;
}

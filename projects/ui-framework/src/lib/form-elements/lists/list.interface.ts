export interface ListHeader {
  groupName: string;
  isCollapsed: boolean;
  placeHolderSize: number;
  selected: boolean;
}

export interface ListOption {
  isPlaceHolder: boolean;
  groupName: string;
  value: string;
  id: number | string;
  selected: boolean;
  prefixComponent?: ListComponentPrefix;
}

export interface SelectGroupOption {
  groupName: string;
  options?: SelectOption[];
}

export interface SelectOption {
  value: string;
  id: number | string;
  prefixComponent?: ListComponentPrefix;
}

export interface ListComponentPrefix {
  component: any;
  attributes: any;
}

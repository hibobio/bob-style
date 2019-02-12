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
}

export interface SelectGroupOption {
  groupName: string;
  options?: SelectOptions[];
}

export interface SelectOptions {
  value: string;
  id: number | string;
}

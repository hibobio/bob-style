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
  prefixComponent?: ListComponent;
}

export interface SelectGroupOption {
  groupName: string;
  options?: SelectOption[];
}

export interface SelectOption {
  value: string;
  id: number | string;
  prefixComponent?: ListComponent;
}

export interface ListComponent {
  component: any;
  attributes: any;
}

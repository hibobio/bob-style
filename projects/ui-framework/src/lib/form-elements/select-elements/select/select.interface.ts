export interface SelectGroupOption {
  groupName: string;
  options?: SelectOptions[];
}

export interface SelectOptions {
  value: string;
  id: number;
}

export interface SelectionGroupOption {
  groupName: string;
  isCollapsed: boolean;
  groupHeader: SelectionOption;
  options: SelectionOption[];
}

export interface SelectionOption extends SelectOptions {
  groupName: string;
  isGroupHeader: boolean;
}

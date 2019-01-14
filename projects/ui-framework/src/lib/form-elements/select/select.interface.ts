export interface SelectGroupOption {
  groupName: string;
  options?: SelectOptions[];
}

export interface SelectOptions {
  value: string;
  id: number;
  selected: boolean;
}

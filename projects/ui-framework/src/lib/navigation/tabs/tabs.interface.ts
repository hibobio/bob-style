export interface Tab {
  label: string;
  key?: string;
}

export interface TabChangeEvent {
  index: number;
  tab: Tab;
}

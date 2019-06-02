export interface MenuItem {
  children?: MenuItem[];
  label: string;
  disabled?: boolean;
  key?: string;
  action?($event): void;
}

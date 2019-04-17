export interface MenuItem {
  children?: MenuItem[];
  label: string;
  disabled?: boolean;
  action?($event): void;
}

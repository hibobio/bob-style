export interface MenuItem {
  children?: MenuItem[];
  label: string;
  action?($event): void;
}

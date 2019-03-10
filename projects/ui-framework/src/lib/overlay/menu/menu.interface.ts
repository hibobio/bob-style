export interface MenuItem {
  children?: MenuItem[];
  displayName: string;
  action?($event): void;
}

export interface SingleListMenuItem {
  label: string;
  key?: string;
  action?($event): void;
}

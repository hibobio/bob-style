import { DialogSize } from './dialog.enum';

export interface DialogConfig {
  size: DialogSize;
  panelClass: string;
  data: any;
}

export interface DialogButtons {
  ok: DialogButton;
  cancel?: DialogButton;
}

export interface DialogButton {
  label: string;
  action?(): void;
}

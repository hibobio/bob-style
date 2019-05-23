import { DialogSize } from './dialog.enum';

export interface DialogConfig {
  size: DialogSize;
  panelClass: string;
  data: any;
}

export interface DialogButtons {
  ok: DialogButton;
  cancel?: DialogButton;
  preloaderMessage?: string;
  confirmation?: DialogConfirmation;
}

export interface DialogButton {
  label: string;
  action?(): any;
}

export interface DialogConfirmation {
  title: string;
  subTitle?: string;
  buttonLabel: string;
}

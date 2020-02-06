import { DialogSize } from './dialog.enum';
import { ButtonType } from '../../buttons/buttons.enum';

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
  disabled?: boolean;
  class?: string;
  type?: ButtonType;
  action?(): any;
}

export interface DialogConfirmation {
  title?: string;
  subTitle?: string;
  buttonLabel: string;
  buttonClass?: string;
  buttonType?: ButtonType;
}

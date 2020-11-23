import { DialogButton } from '../dialog/dialog.interface';

export interface ConfirmationDialogConfig {
  buttonConfig?: ConfirmationDialogButtons;
  title?: string;
  class?: string;
  message?: string;
  confirmationData?: ConfirmationData;
}

export interface ConfirmationDialogButtons {
  ok?: DialogButton;
  cancel?: DialogButton;
}

export interface ConfirmationData {
  confirmationText?: string;
  label?: string;
  placeholder?: string;
  hintMessage?: string;
  errorMessage?: string;
}

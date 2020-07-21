import { DialogSize } from './dialog.enum';
import { DialogConfig } from './dialog.interface';

export const DIALOG_SIZE_TO_WIDTH = {
  [DialogSize.small]: '480px',
  [DialogSize.medium]: '720px',
  [DialogSize.large]: '960px',
  [DialogSize.xLarge]: '90vw',
};

export const DIALOG_CONFIG_DEF: Partial<DialogConfig> = {
  closeOnNavigation: true,
  backdropClass: 'b-dialog-backdrop',
  hasBackdrop: true,
  disableClose: false,
  maxWidth: '90vw',
  autoFocus: false,
};

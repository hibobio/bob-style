import { DialogSize } from './dialog.enum';

export const DIALOG_SIZE_TO_WIDTH = {
  [DialogSize.small]: '480px',
  [DialogSize.medium]: '720px',
  [DialogSize.large]: '960px',
  [DialogSize.xLarge]: '90vw',
};

export const DIALOG_CONFIG_DEF = {
  closeOnNavigation: true,
  backdropClass: 'b-dialog-backdrop',
  hasBackdrop: true,
  disableClose: false,
  maxWidth: '90vw',
  autoFocus: false,
};

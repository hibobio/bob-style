import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { DialogConfig } from '../dialog.interface';
import { DialogSize } from '../dialog.enum';
import { DocumentRef } from '../../../services/utils/document-ref.service';
import { WindowRef } from '../../../services/utils/window-ref.service';

const DIALOG_SIZE_TO_WIDTH = {
  [DialogSize.small]: 480,
  [DialogSize.medium]: 720,
  [DialogSize.large]: 960,
  [DialogSize.xLarge]: '90vw',
};

const DIALOG_CONFIG_DEF = {
  closeOnNavigation: true,
  backdropClass: 'b-dialog-backdrop',
  hasBackdrop: true,
  disableClose: false,
  maxWidth: '90vw',
  autoFocus: false,
};

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private dialog: MatDialog,
    private windowRef: WindowRef,
    private documentRef: DocumentRef
  ) {}

  openDialog(
    dialogComponent: ComponentType<any>,
    config: DialogConfig
  ): MatDialogRef<any> {
    if (!config.panelClass) {
      console.warn('DialogService: panelClass must be provided');
      return;
    }

    const scrollBarGap =
      this.windowRef.nativeWindow.innerWidth -
      this.documentRef.nativeDocument.documentElement.clientWidth;

    this.documentRef.nativeDocument.body.style.paddingRight = `${scrollBarGap}px`;

    const dialogConfig: MatDialogConfig = Object.assign(
      {},
      DIALOG_CONFIG_DEF,
      config,
      {
        width: DIALOG_SIZE_TO_WIDTH[config.size],
        panelClass: [
          'b-dialog-panel',
          `size-${config.size}`,
          config.panelClass,
        ],
      }
    );

    const dialogRef = this.dialog.open(dialogComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe(() =>
        this.documentRef.nativeDocument.body.style.removeProperty(
          'padding-right'
        )
      );

    return dialogRef;
  }
}

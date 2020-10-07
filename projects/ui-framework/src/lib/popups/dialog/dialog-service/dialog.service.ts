import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { DialogConfig } from '../dialog.interface';
import { DocumentRef } from '../../../services/utils/document-ref.service';
import { WindowRef } from '../../../services/utils/window-ref.service';
import { DIALOG_CONFIG_DEF, DIALOG_SIZE_TO_WIDTH } from '../dialog.const';

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
      console.warn(
        'DialogService: panelClass should be provided and it was not'
      );
    }

    const scrollBarGap =
      this.windowRef.nativeWindow.innerWidth -
      this.documentRef.nativeDocument.documentElement.clientWidth;

    this.documentRef.nativeDocument.body.style.paddingRight = `${scrollBarGap}px`;

    const dialogConfig: DialogConfig = Object.assign(
      {},
      DIALOG_CONFIG_DEF,
      config,
      {
        width: DIALOG_SIZE_TO_WIDTH[config.size],
        panelClass: [
          'b-dialog-panel',
          `size-${config.size}`,
          config.panelClass,
        ].filter(Boolean),
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

import { EMPTY, merge, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { ComponentType } from '@angular/cdk/portal';
import { Injectable, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Keys } from '../../../enums';
import { DocumentRef } from '../../../services/utils/document-ref.service';
import { unsubscribeArray } from '../../../services/utils/functional-utils';
import { log } from '../../../services/utils/logger';
import { filterKey, insideZone } from '../../../services/utils/rxjs.operators';
import { UtilsService } from '../../../services/utils/utils.service';
import { WindowRef } from '../../../services/utils/window-ref.service';
import { DIALOG_CONFIG_DEF, DIALOG_SIZE_TO_WIDTH } from '../dialog.const';
import { DialogConfig } from '../dialog.interface';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private dialog: MatDialog,
    private windowRef: WindowRef,
    private documentRef: DocumentRef,
    private utilsService: UtilsService,
    private zone: NgZone
  ) {}

  private readonly subs: Subscription[] = [];

  openDialog(
    dialogComponent: ComponentType<any>,
    config: DialogConfig
  ): MatDialogRef<any> {
    if (!config.panelClass) {
      log.wrn('panelClass should be provided and it was not', 'DialogService');
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

        disableClose:
          config.disableClose === true || config.closeOnBackdropClick !== true,
      }
    );

    const dialogRef = this.dialog.open(dialogComponent, dialogConfig);

    this.subs.push(
      merge(
        dialogConfig.disableClose && config.closeOnBackdropClick === true
          ? dialogRef.backdropClick()
          : EMPTY,

        dialogConfig.disableClose && !config.disableClose
          ? this.utilsService
              .getWindowKeydownEvent(true)
              .pipe(filterKey(Keys.escape), insideZone(this.zone))
          : EMPTY
      )
        .pipe(take(1))
        .subscribe(() => {
          dialogRef.close();
        })
    );

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        unsubscribeArray(this.subs);
        this.documentRef.nativeDocument.body.style.removeProperty(
          'padding-right'
        );
      });

    return dialogRef;
  }
}

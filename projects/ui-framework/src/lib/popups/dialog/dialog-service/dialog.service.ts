import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import assign from 'lodash/assign';
import { DialogConfig } from '../dialog.interface';
import { DialogSize } from '../dialog.enum';

@Injectable()
export class DialogService {

  readonly dialogSizeToWidth = {
    [DialogSize.small]: 450,
    [DialogSize.medium]: 700,
    [DialogSize.large]: 960,
    [DialogSize.xLarge]: '90vw',
  };

  constructor(
    private dialog: MatDialog,
  ) {
  }

  openDialog(
    dialogComponent: ComponentType<any>,
    config: DialogConfig,
  ): MatDialogRef<any> {
    const scrollBarGap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${ scrollBarGap }px`;

    const dialogConfig: MatDialogConfig = assign(config, {
      width: this.dialogSizeToWidth[config.size],
      closeOnNavigation: true,
      backdropClass: 'b-dialog-backdrop',
      panelClass: ['b-dialog-panel', `size-${ config.size }`, config.panelClass],
      hasBackdrop: true,
      disableClose: false,
      maxWidth: '90vw',
    });

    const dialogRef = this.dialog.open(dialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(() => document.body.style.paddingRight = '0');

    return dialogRef;
  }
}

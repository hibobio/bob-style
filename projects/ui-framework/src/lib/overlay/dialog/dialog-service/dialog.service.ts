import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
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
  };

  constructor(
    private dialog: MatDialog,
  ) {
  }

  openDialog(
    dialogComponent: ComponentType<any>,
    config: DialogConfig,
  ): MatDialogRef<any> {
    const dialogConfig: MatDialogConfig = assign(config, {
      width: this.dialogSizeToWidth[config.size],
      closeOnNavigation: true,
      backdropClass: 'b-dialog-backdrop',
      panelClass: ['b-dialog-panel', `size-${config.size}`, config.panelClass],
      hasBackdrop: true,
      disableClose: false,
    });

    return this.dialog.open(dialogComponent, dialogConfig);
  }
}

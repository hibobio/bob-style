import { MatDialog, MatDialogConfig } from '@angular/material';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import assign from 'lodash/assign';
import { DialogConfig } from './dialog.interface';
import { DialogSize } from './dialog.enum';

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
  ): void {
    const dialogConfig: MatDialogConfig = assign(config, {
      width: this.dialogSizeToWidth[config.size],
      closeOnNavigation: true,
      backdropClass: 'b-dialog-backdrop',
      panelClass: ['b-dialog-panel', config.panelClass],
      hasBackdrop: true,
      disableClose: true,
    });

    this.dialog.open(dialogComponent, dialogConfig);
  }
}

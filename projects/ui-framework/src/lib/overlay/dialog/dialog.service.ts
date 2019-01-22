import { MatDialog } from '@angular/material';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {
  constructor(
    private dialog: MatDialog,
  ) {

  }

  openDialog(componentRef: ComponentType<any>, config: any): void {
    const dialogRef = this.dialog.open(componentRef, config);

    dialogRef
      .afterClosed()
      .subscribe(result => {
        console.log('The dialog was closed');
      });
  }
}

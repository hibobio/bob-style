import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'b-dialog',
  template: `
    <div mat-dialog-close (click)="closeDialog()">X</div>
    <div mat-dialog-title>
      <b-heading>{{dialogTitle}}</b-heading>
      <ng-content select="[b-dialog-sub-title]"></ng-content>
    </div>
    <!--<div mat-dialog-title>-->
    <!--<ng-content select="[b-dialog-title]"></ng-content>-->
    <!--</div>-->
    <div mat-dialog-content>
      <ng-content select="[b-dialog-content]"></ng-content>
      <!--<b-subheading>Please fill the following details</b-subheading>-->

      <!--<ng-content select="[b-dialog-content]"></ng-content>-->
    </div>
    <div mat-dialog-actions>
      <b-button (click)="onCancel()">{{dialogButtonConfig.cancelLabel}}</b-button>
      <b-button (click)="onOk()">{{dialogButtonConfig.okLabel}}</b-button>
    </div>
  `,
})
export class DialogComponent {

  @Input() dialogTitle: string;
  @Input() dialogButtonConfig: any;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    // console.log('data 2', data);
  }

  onOk(): void {
    console.log('ok');
  }

  onCancel(): void {
    console.log('cancel');
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

// @Component({
//   selector: 'b-dialog-title',
//   template: `
//     <div>hello</div>
//   `,
// })
// export class DialogTitleComponent {
//   constructor() {
//   }
// }

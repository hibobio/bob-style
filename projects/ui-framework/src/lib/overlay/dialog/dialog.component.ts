import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Icons, IconSize } from '../../icons';

@Component({
  selector: 'b-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  @Input() dialogTitle: string;
  @Input() dialogButtonConfig: any;

  icons = Icons;
  iconSize = IconSize;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
  ) {
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

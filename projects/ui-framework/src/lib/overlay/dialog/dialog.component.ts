import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Icons, IconSize } from '../../icons/icons.enum';
import { DialogButtons } from './dialog.interface';

@Component({
  selector: 'b-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @Input() dialogTitle: string;
  @Input() dialogButtons: DialogButtons;

  icons = Icons;
  iconSize = IconSize;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
  ) {
  }

  ngOnInit(): void {
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

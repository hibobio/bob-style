import { Component, Inject, OnDestroy } from '@angular/core';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { Icons } from '../../icons/icons.enum';
import { ConfirmationDialogConfig } from './confirmation-dialog.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'b-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent implements OnDestroy {
  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
  readonly icons = Icons;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: ConfirmationDialogConfig
  ) {}

  ngOnDestroy(): void {
    this.dialogRef.close();
  }
}

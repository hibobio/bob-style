import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Icons } from '../../icons/icons.enum';
import { DialogButton, DialogButtons } from './dialog.interface';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { transition, trigger, useAnimation } from '@angular/animations';
import { slideUpDown } from '../../style/animations';
import get from 'lodash/get';
import has from 'lodash/has';
import isFunction from 'lodash/isFunction';

@Component({
  selector: 'b-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  animations: [
    trigger('confirmMessage', [
      transition(':enter', useAnimation(slideUpDown, {
        params: { timings: '200ms ease-out', from: '100%', to: '0' }
      })),
      transition(':leave', useAnimation(slideUpDown, {
        params: { timings: '200ms ease-out', from: '0', to: '100%' }
      })),
    ])
  ],
})
export class DialogComponent implements OnDestroy {

  @Input() dialogTitle: string;
  @Input() dialogButtons: DialogButtons;

  icons = Icons;
  buttonType = ButtonType;

  showProgress = false;
  showConfirmation = false;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
  ) {
  }

  onOk(): void {
    if (this.shouldShowConfirmationMessage()) {
      this.showConfirmation = true;
    } else {
      this.showConfirmation = false;
      this.invokeDialogActionAsPromise(this.dialogButtons.ok);
    }
  }

  onCancel(): void {
    if (this.showConfirmation) {
      this.showConfirmation = false;
    } else {
      this.invokeDialogActionAsPromise(this.dialogButtons.cancel);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private invokeDialogActionAsPromise(dialogButton: DialogButton): void {
    if (this.hasAction(dialogButton)) {
      this.showProgress = true;
      Promise.resolve(dialogButton.action())
        .then(res => this.dialogRef.close(res))
        .catch((err) => {
          this.showProgress = false;
        });
    } else {
      this.dialogRef.close();
    }
  }

  private hasAction(dialogButton: DialogButton): boolean {
    const fn = get(dialogButton, 'action', null);
    return isFunction(fn);
  }

  private shouldShowConfirmationMessage(): boolean {
    return has(this.dialogButtons, 'confirmation') &&
      !this.showConfirmation;
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }
}

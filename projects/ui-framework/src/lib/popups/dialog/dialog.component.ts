import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Icons } from '../../icons/icons.enum';
import { DialogButton, DialogButtons } from './dialog.interface';
import { ButtonSize, ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { transition, trigger, useAnimation } from '@angular/animations';
import { SLIDE_UP_DOWN } from '../../style/animations';
import { get, has, isFunction } from 'lodash';
import { DialogScrollDir } from './dialog.enum';

@Component({
  selector: 'b-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  animations: [
    trigger('confirmMessage', [
      transition(':enter', useAnimation(SLIDE_UP_DOWN, {
        params: { timings: '200ms ease-out', from: '20px', to: '-100%' }
      })),
      transition(':leave', useAnimation(SLIDE_UP_DOWN, {
        params: { timings: '200ms ease-out', from: '-100%', to: '20px' }
      })),
    ])
  ],
})
export class DialogComponent implements OnDestroy {

  @Input() dialogTitle: string;
  @Input() dialogButtons: DialogButtons;

  icons = Icons;
  buttonType = ButtonType;
  buttonSize = ButtonSize;

  showProgress = false;
  showConfirmation = false;

  readonly dialogScrollDir = DialogScrollDir;
  showScrolling: DialogScrollDir = null;
  private oldScrollPos = 0;

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

  onScroll($event: Event): void {
    const scrollTop = ($event.target as HTMLElement).scrollTop;
    this.showScrolling = scrollTop > this.oldScrollPos ? DialogScrollDir.top : DialogScrollDir.bottom;
    this.oldScrollPos = scrollTop;
  }

  private invokeDialogActionAsPromise(dialogButton: DialogButton): void {
    if (this.hasAction(dialogButton)) {
      this.showProgress = true;
      Promise.resolve(dialogButton.action())
        .then(res => {
          if (res === false) {
            this.showProgress = false;
          } else {
            this.dialogRef.close(res);
          }
        })
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
    return has(this.dialogButtons, 'confirmation') && !this.showConfirmation;
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }
}

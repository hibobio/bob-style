import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Icons } from '../../icons/icons.enum';
import { DialogButton, DialogButtons } from './dialog.interface';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { transition, trigger, useAnimation } from '@angular/animations';
import { SLIDE_UP_DOWN } from '../../style/animations';
import { DialogScrollDir } from './dialog.enum';
import { isBoolean, isFunction } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  animations: [
    trigger('confirmMessage', [
      transition(
        ':enter',
        useAnimation(SLIDE_UP_DOWN, {
          params: { timings: '200ms ease-out', from: '20px', to: '-100%' },
        })
      ),
      transition(
        ':leave',
        useAnimation(SLIDE_UP_DOWN, {
          params: { timings: '200ms ease-out', from: '-100%', to: '20px' },
        })
      ),
    ]),
  ],
})
export class DialogComponent implements OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() dialogTitle: string;
  @Input() dialogButtons: DialogButtons;
  @Input() showProgress = false;
  @Input('showConfirmation') set setConfirmationControl(show: boolean) {
    if (isBoolean(show)) {
      this.confirmationControlFromAbove = true;

      if (this.showConfirmation !== show) {
        this.showConfirmation = show;
        this.cdr.detectChanges();
      }
    }
  }
  @Input('closeDialog') set doCloseDialog(close: boolean) {
    if (close === true) {
      this.closeDialog();
    }
  }

  @Output() clickedOK: EventEmitter<void> = new EventEmitter<void>();
  @Output() clickedCancel: EventEmitter<void> = new EventEmitter<void>();

  public showConfirmation = false;
  public showScrolling: DialogScrollDir = null;

  readonly icons = Icons;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;

  readonly dialogScrollDir = DialogScrollDir;
  private oldScrollPos = 0;
  private confirmationControlFromAbove = false;

  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  public onOk(): void {
    if (this.clickedOK.observers.length) {
      this.clickedOK.emit();
      return;
    }

    if (
      this.dialogButtons.confirmation &&
      !this.confirmationControlFromAbove &&
      !this.showConfirmation
    ) {
      this.showConfirmation = true;
      return;
    }

    if (!this.confirmationControlFromAbove) {
      this.showConfirmation = false;
    }

    this.invokeDialogActionAsPromise(this.dialogButtons.ok);
  }

  public onCancel(): void {
    if (this.clickedCancel.observers.length) {
      this.clickedCancel.emit();
      return;
    }

    if (!this.confirmationControlFromAbove && this.showConfirmation) {
      this.showConfirmation = false;
    } else {
      this.invokeDialogActionAsPromise(this.dialogButtons.cancel);
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public onScroll($event: Event): void {
    const scrollTop = ($event.target as HTMLElement).scrollTop;
    this.showScrolling =
      scrollTop > this.oldScrollPos
        ? DialogScrollDir.top
        : DialogScrollDir.bottom;
    this.oldScrollPos = scrollTop;
  }

  private invokeDialogActionAsPromise(dialogButton: DialogButton): void {
    if (isFunction(dialogButton.action)) {
      this.showProgress = true;
      Promise.resolve(dialogButton.action())
        .then((res) => {
          if (res === false) {
            this.showProgress = false;
            this.cdr.detectChanges();
          } else {
            this.dialogRef.close(res);
          }
        })
        .catch((err) => {
          this.showProgress = false;
          this.cdr.detectChanges();
        });
    } else {
      this.closeDialog();
    }
  }
}

import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  startWith,
  throttleTime,
} from 'rxjs/operators';

import { transition, trigger, useAnimation } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { Icons } from '../../icons/icons.enum';
import { isBoolean, isFunction } from '../../services/utils/functional-utils';
import { WindowRef } from '../../services/utils/window-ref.service';
import { SLIDE_UP_DOWN } from '../../style/animations';
import { DialogButton, DialogButtons } from './dialog.interface';

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
export class DialogComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    private cdr: ChangeDetectorRef,
    private windowRef: WindowRef
  ) {
    this.isEmbedMode = this.windowRef.isEmbedMode();
  }

  @ViewChild(CdkScrollable, { static: true }) scrollable: CdkScrollable;

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

  @Output() clickedOK: EventEmitter<void> = new EventEmitter();
  @Output() clickedCancel: EventEmitter<void> = new EventEmitter();

  public showConfirmation = false;

  readonly icons = Icons;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;

  private readonly isEmbedMode: boolean;

  private confirmationControlFromAbove = false;

  public scrolled$: Observable<boolean>;

  @HostListener('window:popstate') closeModalOnHistoryBack() {
    if (!this.isEmbedMode && this.dialogRef['closeOnNavigation'] !== false) {
      this.closeDialog();
    }
  }

  ngOnInit(): void {
    if (!this.isEmbedMode && this.dialogRef['closeOnNavigation'] !== false) {
      this.windowRef.nativeWindow.history.pushState(
        {
          modal: true,
          desc: 'modal is open',
        },
        null
      );
    }

    this.scrolled$ = this.scrollable.elementScrolled().pipe(
      startWith(false),
      throttleTime(100, undefined, {
        leading: true,
        trailing: true,
      }),
      map(() => {
        return this.scrollable.measureScrollOffset('top') > 20;
      }),
      distinctUntilChanged()
    );
  }

  ngOnDestroy(): void {
    if (
      !this.isEmbedMode &&
      this.dialogRef['closeOnNavigation'] !== false &&
      this.windowRef.nativeWindow.history.state?.modal
    ) {
      this.windowRef.nativeWindow.historyistory.back();
    }
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

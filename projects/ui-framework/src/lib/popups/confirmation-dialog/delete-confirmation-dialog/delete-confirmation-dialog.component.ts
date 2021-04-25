import { merge, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs/operators';

import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { ButtonType } from '../../../buttons/buttons.enum';
import { InputEventType } from '../../../form-elements/form-elements.enum';
import { InputComponent } from '../../../form-elements/input/input.component';
import { normalizeString } from '../../../services/utils/functional-utils';
import {
  ConfirmationDialogButtons,
  ConfirmationDialogConfig,
} from '../confirmation-dialog.interface';

@Component({
  selector: 'b-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      b-input {
        min-height: 90px;
        margin-bottom: -16px;
      }
    `,
  ],
})
export class DeleteConfirmationDialogComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: ConfirmationDialogConfig,
    private translateService: TranslateService
  ) {
    const confirmationText = 'DELETE';
    this.confirmationText = confirmationText;

    this.defaultLabel = this.translateService.instant(
      'bob-style.delete-confirmation.default.label', { confirmationText: confirmationText }
    );
  }

  @ViewChild(InputComponent, { static: true }) bInput: InputComponent;

  valid$: Observable<boolean>;
  buttonConfig$: Observable<ConfirmationDialogButtons>;

  defaultLabel: string;
  private readonly confirmationText: string;

  ngOnInit() {
    this.valid$ = this.getIsValidObservable();
    this.buttonConfig$ = this.getButtonConfigObservable();
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  private getButtonConfigObservable(): Observable<ConfirmationDialogButtons> {
    return this.getIsValidObservable().pipe(
      startWith(false),
      map((valid) => {
        return {
          ...this.config?.buttonConfig,
          cancel: {
            label: this.translateService.instant('common.cancel'),
            ...this.config?.buttonConfig?.cancel,
          },
          ok: {
            label: this.translateService.instant('common.delete'),
            type: ButtonType.negative,
            ...this.config?.buttonConfig?.ok,
            disabled: !valid,
            action: () => Promise.resolve(true),
          },
        };
      })
    );
  }

  private getIsValidObservable(): Observable<boolean> {
    return merge(
      this.bInput.changed.pipe(
        filter((event) => event.event !== InputEventType.onBlur),
        debounceTime(500)
      ),
      this.bInput.changed.pipe(
        filter((event) => event.event === InputEventType.onBlur)
      )
    ).pipe(
      map((event) => {
        const normalized = normalizeString(event.value).trim();
        return normalized === this.confirmationText || normalized === 'delete';
      }),
      distinctUntilChanged()
    );
  }
}

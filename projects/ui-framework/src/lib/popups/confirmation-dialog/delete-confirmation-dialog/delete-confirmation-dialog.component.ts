import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonType, ConfirmationDialogConfig, InputComponent, InputEventType } from 'bob-style';
import { merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogButtons } from '../confirmation-dialog.interface';

@Component({
  selector: 'b-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html'
})

export class DeleteConfirmationDialogComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: ConfirmationDialogConfig,
    private translateService: TranslateService
  ) {
    this.confirmationText = config?.confirmationData?.confirmationText ??
      this.translateService.instant('common.delete');
    this.defaultLabel = this.translateService.instant('bob-style.delete-confirmation.default.label', {
      confirmationText: config?.confirmationData?.label ??
        this.confirmationText
    });
  }

  @ViewChild(InputComponent, {static: true}) bInput: InputComponent;

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
            label: this.translateService.instant('common.ok'),
            type: ButtonType.negative,
            ...this.config?.buttonConfig?.ok,
            disabled: !valid,
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
      map(
        (event) =>
          event.value === this.confirmationText
      ),
      distinctUntilChanged()
    );
  }
}

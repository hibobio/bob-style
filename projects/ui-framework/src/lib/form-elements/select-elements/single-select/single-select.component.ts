import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { SelectGroupOption } from '../select.interface';
import { BaseFormElement } from '../../base-form-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../../base-input-element';

@Component({
  selector: 'b-single-select',
  template: `
    <b-select [options]="options"
              [value]="[value]"
              [isMultiSelect]="false"
              [showSingleGroupHeader]="showSingleGroupHeader"
              (selectChange)="onSelectChange($event)"
              [hintMessage]="hintMessage"
              [errorMessage]="errorMessage"
              [required]="required"
              [disabled]="disabled"
              [label]="label">
    </b-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true
    }
  ],
})
export class SingleSelectComponent extends BaseFormElement {

  @Input() options: SelectGroupOption[] = [];
  @Input() value: (string | number);
  @Input() showSingleGroupHeader = false;
  @Input() label: string;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Output() selectChange: EventEmitter<number | string> = new EventEmitter<number | string>();

  constructor() {
    super();
  }

  onSelectChange(val: (string | number)[]): void {
    const value = val[0];
    this.propagateChange(value);
    this.selectChange.emit(value);
  }
}

import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { SelectGroupOption } from '../select.interface';
import { BaseFormElement } from '../../base-form-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'b-single-select',
  template: `
    <b-select [options]="options"
              [value]="[value]"
              [isMultiSelect]="false"
              [showSingleGroupHeader]="showSingleGroupHeader"
              (selectChange)="onSelectChange($event)"
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
  @Input() label: string | number;
  @Input() showSingleGroupHeader = false;
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

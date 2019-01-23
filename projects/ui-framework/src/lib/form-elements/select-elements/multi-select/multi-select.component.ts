import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { SelectGroupOption } from '../select.interface';
import { BaseFormElement } from '../../base-form-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'b-multi-select',
  template: `
    <b-select [options]="options"
              [value]="value"
              [isMultiSelect]="true"
              [showSingleGroupHeader]="showSingleGroupHeader"
              (selectChange)="onSelectChange($event)"
              [label]="label">
    </b-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ],
})
export class MultiSelectComponent extends BaseFormElement {

  @Input() options: SelectGroupOption[] = [];
  @Input() value: (string | number)[] = [];
  @Input() showSingleGroupHeader = false;
  @Input() label: string | number;
  @Output() selectChange: EventEmitter<(number | string)[]> = new EventEmitter<(number | string)[]>();

  constructor() {
    super();
  }

  onSelectChange(value: (string | number)[]): void {
    this.selectChange.emit(value);
  }
}

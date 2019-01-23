import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectGroupOption } from '../select.interface';
import { BaseFormElement } from '../../base-form-element';

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

  onSelectChange(value: (string | number)[]): void {
    this.selectChange.emit(value[0]);
  }
}

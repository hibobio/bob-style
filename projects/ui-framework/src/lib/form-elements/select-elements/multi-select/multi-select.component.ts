import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectGroupOption } from '../select.interface';
import { BaseFormElement } from '../../base-form-element';

@Component({
  selector: 'b-multi-select',
  template: `
    <b-select [options]="options"
              [selectedIds]="selectedIds"
              [isMultiSelect]="true"
              [showSingleGroupHeader]="showSingleGroupHeader"
              (selectChange)="onSelectChange($event)"
              [label]="label">
    </b-select>
  `,
})
export class MultiSelectComponent extends BaseFormElement {

  @Input() options: SelectGroupOption[] = [];
  @Input() selectedIds: (string | number)[] = [];
  @Input() showSingleGroupHeader = false;
  @Input() label: string | number;
  @Output() selectChange: EventEmitter<(number | string)[]> = new EventEmitter<(number | string)[]>();

  constructor() {
    super();
  }

  onSelectChange(selectionIds: (string | number)[]): void {
    this.selectChange.emit(selectionIds);
  }
}

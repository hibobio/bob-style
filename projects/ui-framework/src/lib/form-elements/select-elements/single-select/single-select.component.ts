import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectGroupOption } from '../select.interface';
import { BaseFormElement } from '../../base-form-element';

@Component({
  selector: 'b-single-select',
  template: `
    <b-select [options]="options"
              [selectedIds]="[selectedId]"
              [isMultiSelect]="false"
              [showSingleGroupHeader]="showSingleGroupHeader"
              (selectChange)="onSelectChange($event)"
              [label]="label">
    </b-select>
  `,
})
export class SingleSelectComponent extends BaseFormElement {

  @Input() options: SelectGroupOption[] = [];
  @Input() selectedId: (string | number);
  @Input() label: string | number;
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<number | string> = new EventEmitter<number | string>();

  constructor() {
    super();
  }

  onSelectChange(selectionIds: (string | number)[]): void {
    this.selectChange.emit(selectionIds[0]);
  }
}

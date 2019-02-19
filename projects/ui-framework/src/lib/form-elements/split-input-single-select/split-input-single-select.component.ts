import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BaseInputElement } from '../base-input-element';
import { SelectGroupOption } from '../lists/list.interface';
import { InputEventType, InputTypes } from '../input/input.enum';
import { InputSingleSelectValue } from './split-input-single-select.interface';
import assign from 'lodash/assign';
import { InputEvent } from '../input/input.interface';

@Component({
  selector: 'b-split-input-single-select',
  templateUrl: './split-input-single-select.component.html',
  styleUrls: ['./split-input-single-select.component.scss'],
})
export class SplitInputSingleSelectComponent extends BaseInputElement implements OnChanges {

  @Input() value: InputSingleSelectValue;
  @Input() inputType: InputTypes;
  @Input() selectOptions: SelectGroupOption[];
  @Output() elementChange: EventEmitter<InputSingleSelectValue> = new EventEmitter<InputSingleSelectValue>();

  readonly baseValue: InputSingleSelectValue = {
    inputValue: null,
    selectValue: null,
  };

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.value = assign({}, this.baseValue, this.value);
  }

  onInputChange($event: InputEvent): void {
    if ($event.event === InputEventType.onChange) {
      this.value.inputValue = $event.value;
      this.emitChange();
    }
  }

  onSelectChange(selectId): void {
    this.value.selectValue = selectId;
    this.emitChange();
  }

  private emitChange(): void {
    this.elementChange.emit(this.value);
  }
}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseInputElement } from '../base-input-element';
import { SelectGroupOption } from '../lists/list.interface';
import { InputEventType, InputTypes } from '../input/input.enum';
import { InputSingleSelectValue } from './split-input-single-select.interface';
import { assign, has, map } from 'lodash';
import { InputEvent } from '../input/input.interface';
import { ListChange } from '../lists/list-change/list-change';

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

  options: SelectGroupOption[];

  readonly baseValue: InputSingleSelectValue = {
    inputValue: null,
    selectValue: null,
  };

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.value = assign({}, this.baseValue, this.value);
    if (has(changes, 'selectOptions')) {
      this.selectOptions = changes.selectOptions.currentValue;
      this.options = this.enrichOptionsWithSelection(this.selectOptions);
    }
  }

  onInputChange($event: InputEvent): void {
    if ($event.event === InputEventType.onChange) {
      this.value.inputValue = $event.value;
      this.emitChange();
    }
  }

  onSelectChange(listChange: ListChange): void {
    this.value.selectValue = listChange.getSelectedIds()[0];
    this.emitChange();
  }

  private emitChange(): void {
    this.elementChange.emit(this.value);
  }

  private enrichOptionsWithSelection(options: SelectGroupOption[]): SelectGroupOption[] {
    return map(options, g => assign({}, g, {
        options: map(g.options, o =>
          assign({}, o, { selected: o.id === this.value.selectValue }),
        ),
      }),
    );
  }
}

import { Component, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InputEventType, InputTypes } from '../../form-elements/input/input.enum';
import { set, has } from 'lodash';
import { InputEvent } from '../../form-elements/input/input.interface';
import { BaseInputElement } from '../../form-elements/base-input-element';

@Component({
  selector: 'b-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends BaseInputElement implements OnChanges {

  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() inputChange: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  searchIconColor: String = IconColor.normal;

  inputTypes = InputTypes;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (has(changes, 'value')) {
      this.value = changes.value.currentValue;
    } else {
      this.value = this.value || '';
    }
  }

  onInputEvents(event: InputEvent): void {
    this.inputChange.emit(event);
    this.value = event.value as string;
    if (event.event === InputEventType.onChange) {
      this.searchChange.emit(this.value);
    }
    if (event.event === InputEventType.onFocus) {
      this.searchIconColor = IconColor.dark;
    }
    if (event.event === InputEventType.onBlur) {
      this.searchIconColor = IconColor.normal;
    }
  }

  onResetClick() {
    this.value = '';
    this.searchChange.emit(this.value);
  }
}

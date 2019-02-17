import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons';
import { InputEventType, InputTypes } from '../../form-elements/input/input.enum';
import { set } from 'lodash';
import { InputEvent } from '../../form-elements/input/input.interface';
import { BaseInputElement } from '../../form-elements/base-input-element';

@Component({
  selector: 'b-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends BaseInputElement implements OnInit {

  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

  readonly searchIcon: String = Icons.search;
  readonly resetIcon: String = Icons.reset_x;
  readonly iconSize: String = IconSize.medium;
  iconColor = IconColor;
  searchIconColor: String = IconColor.normal;

  inputTypes = InputTypes;

  constructor() {
    super();
  }

  ngOnInit() {
    this.value = '';
  }

  onInputEvents(event: InputEvent): void {
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
  }
}

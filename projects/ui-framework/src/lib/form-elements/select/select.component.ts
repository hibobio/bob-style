import { Component, OnInit } from '@angular/core';
import { InputEvent } from '../input/input.interface';
import { MatSelectChange } from '@angular/material';
import { SelectGroupOption } from './select.interface';
import { ButtonSize, ButtonType } from '../../buttons';

const navigationKeys = new Set(['ArrowUp', 'ArrowDown', 'Enter']);
const optionsMock = [
  {
    groupName: 'Basic Info',
    options: [
      { value: 'email', id: 1, selected: false },
      { value: 'first name', id: 2, selected: true },
      { value: 'last name', id: 3, selected: false },
      { value: 'last name', id: 3, selected: false },
      { value: 'last name', id: 3, selected: false },
      { value: 'last name', id: 3, selected: false },
      { value: 'last name', id: 3, selected: false },
      { value: 'last name', id: 3, selected: false },
      { value: 'last name', id: 3, selected: false },
      { value: 'last name', id: 3, selected: false },
    ],
  },
  {
    groupName: 'Personal',
    options: [
      { value: 'phone', id: 1, selected: false },
      { value: 'title', id: 2, selected: true },
    ],
  },
];

@Component({
  selector: 'b-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {

  options: SelectGroupOption[];
  selectionOptions: string[];

  buttonType = ButtonType;
  buttonSize = ButtonSize;

  constructor() {
  }

  ngOnInit(): void {
    this.options = optionsMock;
    this.selectionOptions = ['one', 'two', 'three'];
  }

  onSearchKeyDown($event) {
    if (!navigationKeys.has($event.code)) {
      $event.stopPropagation();
    }
  }

  onInputEvents(inputEvent: InputEvent): void {
    // todo: filter values by inputEvent.value
  }

  onSelectionChange($event: MatSelectChange) {
    // todo: emit select change event
  }
}

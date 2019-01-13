import { Component, OnInit } from '@angular/core';
import { InputEvent } from '../input/input.enum';
import { MatSelectChange } from '@angular/material';

const navigationKeys = new Set(['ArrowUp', 'ArrowDown', 'Enter']);

@Component({
  selector: 'b-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {

  options: string[];

  constructor() {
  }

  ngOnInit(): void {
    this.options = [
      'One',
      'Two',
      'Three',
    ];
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

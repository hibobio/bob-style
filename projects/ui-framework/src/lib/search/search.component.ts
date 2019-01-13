import { Component, Input, OnInit } from '@angular/core';
import { IconColor, Icons, IconSize } from '../icons';
import { InputComponent } from '../form-elements/input/input.component';
import { InputEvent, InputTypes } from '../form-elements/input/input.enum';

@Component({
  selector: 'b-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends InputComponent implements OnInit {

  readonly searchIcon: String = Icons.search;
  readonly resetIcon: String = Icons.reset_x;
  readonly iconSize: String = IconSize.small;
  readonly iconColor: String = IconColor.dark;

  inputTypes = InputTypes;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onInputEvents(event: InputEvent): void {
    this.value = event.value as string;
  }

  onResetClick() {
    this.value = '';
  }
}

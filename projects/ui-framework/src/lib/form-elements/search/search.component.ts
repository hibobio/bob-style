import { Component, OnInit } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons';
import { InputTypes } from '../input/input.enum';
import { set } from 'lodash';
import { InputEvent } from '../input/input.interface';
import { BaseInputElement } from '../base-input-element';

@Component({
  selector: 'b-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends BaseInputElement implements OnInit {

  readonly searchIcon: String = Icons.search;
  readonly resetIcon: String = Icons.reset_x;
  readonly iconSize: String = IconSize.small;
  readonly iconColor: String = IconColor.dark;

  inputTypes = InputTypes;

  constructor() {
    super();
  }

  ngOnInit() {
    this.value = '';
  }

  onInputEvents(event: InputEvent): void {
    this.value = event.value as string;
  }

  onResetClick() {
    this.value = '';
  }
}

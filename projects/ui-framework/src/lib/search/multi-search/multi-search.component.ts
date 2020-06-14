import { Component, Input } from '@angular/core';
import {
  MultiSearchGroupOption,
  MultiSearchOption,
} from './multi-search.interface';
import { MULTI_SEARCH_KEYMAP_DEF } from './multi-search.const';
import { isFunction } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-multi-search',
  templateUrl: './multi-search.component.html',
  styleUrls: ['./multi-search.component.scss'],
})
export class MultiSearchComponent {
  constructor() {}

  @Input() options: MultiSearchGroupOption[] = [];

  readonly keyMapDef = { ...MULTI_SEARCH_KEYMAP_DEF };

  onOptionClick(
    group: MultiSearchGroupOption,
    option: MultiSearchOption
  ): void {
    console.log(
      `Clicked: ${
        group[group.keyMap?.groupName || this.keyMapDef.groupName]
      } - ${option[group.keyMap?.value || this.keyMapDef.value]}`
    );

    if (isFunction(group.clickHandler)) {
      group.clickHandler(option);
    }
  }
}

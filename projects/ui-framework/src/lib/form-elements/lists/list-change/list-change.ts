import { chain } from 'lodash';
import { SelectGroupOption } from '../list.interface';

export class ListChange {
  private readonly selectGroupOptions: SelectGroupOption[];

  constructor(
    selectedGroupOptionsSrc: SelectGroupOption[],
  ) {
    this.selectGroupOptions = selectedGroupOptionsSrc;
  }

  getSelectGroupOptions(): SelectGroupOption[] {
    return this.selectGroupOptions;
  }

  getSelectedIds(): (number | string)[] {
    return chain(this.selectGroupOptions)
      .flatMap('options')
      .filter(o => o.selected)
      .flatMap('id')
      .value();
  }
}

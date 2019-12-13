import { chain, assign, filter } from 'lodash';
import { SelectGroupOption } from '../list.interface';

export class ListChange {
  public readonly selectGroupOptions: SelectGroupOption[];
  public readonly selectedIDs: (string | number)[];

  constructor(
    selectedGroupOptionsSrc: SelectGroupOption[],
    selectedIDsSrc: (string | number)[] = null
  ) {
    this.selectGroupOptions = selectedGroupOptionsSrc;
    this.selectedIDs = selectedIDsSrc || this.getIds();
  }

  getSelectGroupOptions(): SelectGroupOption[] {
    return this.selectGroupOptions;
  }

  getSelectedIds(): (number | string)[] {
    return this.selectedIDs;
  }

  getSelectedGroupOptions(): SelectGroupOption[] {
    return chain(this.selectGroupOptions)
      .map((groupOptions: SelectGroupOption) =>
        assign({}, groupOptions, {
          options: filter(groupOptions.options, option => option.selected),
        })
      )
      .filter(groupOption => groupOption.options.length)
      .value();
  }

  private getIds(): (number | string)[] {
    return chain(this.selectGroupOptions)
      .flatMap('options')
      .filter(o => o.selected)
      .flatMap('id')
      .value();
  }
}

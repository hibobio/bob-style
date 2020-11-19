import { itemID, SelectGroupOption, SelectOption } from '../list.interface';
import { arrayFlatten } from '../../services/utils/functional-utils';

export class ListChange {
  public readonly selectGroupOptions: SelectGroupOption[];
  public readonly selectedIDs: itemID[];

  constructor(
    selectedGroupOptionsSrc: SelectGroupOption[],
    selectedIDsSrc: itemID[] = null
  ) {
    this.selectGroupOptions = selectedGroupOptionsSrc;
    this.selectedIDs = selectedIDsSrc || this.getSelIds();
  }

  getSelectGroupOptions(): SelectGroupOption[] {
    return this.selectGroupOptions;
  }

  getSelectedIds(): itemID[] {
    return this.selectedIDs;
  }

  getSelectedGroupOptions(
    options: SelectGroupOption[] = this.selectGroupOptions
  ): SelectGroupOption[] {
    return options.reduce(
      (sgo: SelectGroupOption[], group: SelectGroupOption) => {
        const groupSelectedOptions: SelectOption[] = [],
          groupSelectedIDs: itemID[] = [],
          groupSelectedValues: string[] = [];

        group.options.forEach((option) => {
          if (option.selected) {
            groupSelectedOptions.push(option);
            groupSelectedIDs.push(option.id);
            groupSelectedValues.push(option.value);
          }
        });

        if (groupSelectedOptions.length) {
          sgo.push({
            ...group,
            options: groupSelectedOptions,
            groupSelectedIDs,
            groupSelectedValues,
            selectedCount: groupSelectedOptions.length,
          });
        }

        return sgo;
      },
      []
    );
  }

  getDisplayValue(
    options: SelectGroupOption[] = this.selectGroupOptions
  ): string {
    return arrayFlatten<SelectOption>(options.map((group) => group.options))
      .filter((option) => option.selected)
      .map((option) => option.value)
      .join(', ');
  }

  private getSelIds(): itemID[] {
    return arrayFlatten<SelectOption>(
      this.selectGroupOptions.map((group) => group.options)
    )
      .filter((option) => option.selected)
      .map((option) => option.id);
  }
}

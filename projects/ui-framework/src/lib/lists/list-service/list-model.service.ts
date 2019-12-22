import { Injectable } from '@angular/core';
import { escapeRegExp, cloneDeep } from 'lodash';
import { LIST_EL_HEIGHT } from '../list.consts';
import {
  ListOption,
  ListHeader,
  SelectGroupOption,
  SelectOption,
} from '../list.interface';
import {
  arrayFlatten,
  isNullOrUndefined,
  isNotEmptyArray,
  isArray,
  hasProp,
  isEmptyArray,
  isBoolean,
} from '../../services/utils/functional-utils';

@Injectable()
export class ListModelService {
  constructor() {}

  getHeadersModel(
    options: SelectGroupOption[],
    collapseHeaders = false
  ): ListHeader[] {
    return options.map(group => {
      const selectedCount = this.countOptions(group.options, 'selected');

      return Object.assign(
        {
          groupName: group.groupName,
          isCollapsed: collapseHeaders,
          placeHolderSize: group.options.length * LIST_EL_HEIGHT,
          selected: isBoolean(group.selected)
            ? group.selected
            : selectedCount === group.options.length,
          hidden: isBoolean(group.hidden)
            ? group.hidden
            : this.countOptions(group.options, 'hidden') ===
              group.options.length,
          indeterminate: this.isIndeterminate(group.options, selectedCount),
          selectedCount: selectedCount,
        },
        !isNullOrUndefined(group.key) ? { key: group.key } : {}
      );
    });
  }

  getOptionsModel(
    options: SelectGroupOption[],
    listHeaders: ListHeader[],
    noGroupHeaders: boolean
  ): ListOption[] {
    const groupOptions = options.map(
      (group: SelectGroupOption, index: number) => {
        const placeholder = {
          isPlaceHolder: true,
          selected: false,
        };

        let virtualOptions: Partial<ListOption>[];

        if (noGroupHeaders) {
          virtualOptions = group.options.map(option =>
            Object.assign(
              {},
              option,
              {
                groupName: group.groupName,
                isPlaceHolder: false,
                hidden: isBoolean(group.hidden)
                  ? group.hidden
                  : !!option.hidden,
              },
              !isNullOrUndefined(group.key) ? { key: group.key } : {}
            )
          );
        } else if (listHeaders[index].isCollapsed) {
          virtualOptions = [placeholder];
        } else {
          virtualOptions = [].concat(
            placeholder,
            group.options.map(option =>
              Object.assign(
                {},
                option,
                {
                  groupName: group.groupName,
                  isPlaceHolder: false,
                  hidden: isBoolean(group.hidden)
                    ? group.hidden
                    : !!option.hidden,
                },
                !isNullOrUndefined(group.key) ? { key: group.key } : {}
              )
            )
          );
        }
        return virtualOptions;
      }
    );

    return arrayFlatten<ListOption>(groupOptions);
  }

  setSelectedOptions(
    listHeaders: ListHeader[],
    listOptions: ListOption[],
    options: SelectGroupOption[],
    selectedIDs: (number | string)[] = null
  ): void {
    selectedIDs = selectedIDs || this.getSelectedIDs(options);

    listOptions.forEach((option: ListOption) => {
      option.selected = option.isPlaceHolder
        ? false
        : selectedIDs.includes(option.id);
    });

    listHeaders.forEach((header: ListHeader, index: number) => {
      const groupOptions = options[index].options;

      header.selectedCount = this.countOptions(groupOptions, 'selected');
      header.selected = header.selectedCount === groupOptions.length;
      header.indeterminate = this.isIndeterminate(
        groupOptions,
        header.selectedCount
      );
      header.hidden = isBoolean(header.hidden)
        ? header.hidden
        : this.countOptions(groupOptions, 'hidden') === groupOptions.length;
    });
  }

  getFilteredOptions(
    options: SelectGroupOption[],
    searchValue: string
  ): SelectGroupOption[] {
    searchValue = searchValue.trim();
    const matcher = new RegExp(escapeRegExp(searchValue), 'i');

    return searchValue
      ? options
          .map((group: SelectGroupOption) =>
            Object.assign({}, group, {
              options: group.options.filter((option: SelectOption) =>
                matcher.test(option.value)
              ),
            })
          )
          .filter((group: SelectGroupOption) => isNotEmptyArray(group.options))
      : cloneDeep(options);
  }

  getSelectedIDs(
    options: SelectGroupOption[],
    mustBe = 'selected'
  ): (number | string)[] {
    if (isEmptyArray(options)) {
      return [];
    }
    return arrayFlatten<string | number>(
      options.map(group =>
        group.options
          .filter((option: SelectOption) => option.selected && option[mustBe])
          .map((opt: SelectOption) => opt.id)
      )
    );
  }

  countOptions(options: SelectOption[], mustBe = null) {
    return mustBe ? options.filter(opt => opt[mustBe]).length : options.length;
  }

  isIndeterminate(options: SelectOption[], selectedCount = null): boolean {
    selectedCount =
      selectedCount !== null
        ? selectedCount
        : this.countOptions(options, 'selected');
    return selectedCount > 0 && selectedCount < options.length;
  }

  selectAll<T = SelectGroupOption>(options: T[]): T[] {
    options.forEach((option: T) => {
      let allSelected = true;

      if (isArray(option['options'])) {
        option['options'].forEach((opt: SelectOption) => {
          if (opt.disabled && !opt.selected) {
            allSelected = false;
          }
          opt.selected = opt.disabled ? opt.selected : true;
        });
      }

      if (hasProp(option, 'selected')) {
        option['selected'] = allSelected;
      }
    });

    return options;
  }

  deselectAll<T = SelectGroupOption>(options: T[]): T[] {
    options.forEach(option => {
      if (isArray(option['options'])) {
        option['options'].forEach((opt: SelectOption) => {
          opt.selected = opt.disabled ? opt.selected : false;
        });
      }

      if (hasProp(option, 'selected')) {
        option['selected'] = false;
      }
    });

    return options;
  }

  isSameGroup(
    group1: Partial<SelectGroupOption> | Partial<ListHeader>,
    group2: Partial<SelectGroupOption> | Partial<ListHeader>
  ): boolean {
    if (!group1 || !group2) {
      return false;
    }
    return (
      group1 === group2 ||
      (!isNullOrUndefined(group1.key) && group1.key === group2.key) ||
      (isNullOrUndefined(group1.key) && group1.groupName === group2.groupName)
    );
  }

  totalOptionsCount(options: SelectGroupOption[]): number {
    return arrayFlatten(options.map(group => group.options)).length;
  }
}

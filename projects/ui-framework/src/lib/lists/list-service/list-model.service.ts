import { Injectable } from '@angular/core';
import { escapeRegExp, cloneDeep } from 'lodash';
import { LIST_EL_HEIGHT } from '../list.consts';
import {
  ListOption,
  ListHeader,
  SelectGroupOption,
  SelectOption,
  itemID,
} from '../list.interface';
import {
  arrayFlatten,
  isNullOrUndefined,
  isNotEmptyArray,
  isArray,
  hasProp,
  isEmptyArray,
  isBoolean,
  objectRemoveKey,
  isNumber,
} from '../../services/utils/functional-utils';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { FORM_ELEMENT_HEIGHT } from '../../form-elements/form-elements.const';

interface GetHeadersModelConfig {
  collapseHeaders?: boolean;
  hasCheckbox?: boolean;
  allowGroupIsOption?: boolean;
  size?: FormElementSize;
}

interface GetOptionsModelConfig {
  noGroupHeaders?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ListModelService {
  constructor() {}

  getHeadersModel(
    options: SelectGroupOption[],
    {
      collapseHeaders = false,
      hasCheckbox = true,
      allowGroupIsOption = false,
      size = FormElementSize.regular,
    }: GetHeadersModelConfig = {}
  ): ListHeader[] {
    return options.map(
      (group): ListHeader => {
        const selectedCount = this.countOptions(group.options, 'selected');

        const groupIsOption =
          allowGroupIsOption &&
          group.options.length === 1 &&
          group.options[0].value === group.groupName;

        return {
          ...objectRemoveKey(group, 'options'),
          key: this.getGroupKey(group),
          isCollapsed: collapseHeaders || groupIsOption,
          placeHolderSize:
            group.options.length *
            (FORM_ELEMENT_HEIGHT[size] || LIST_EL_HEIGHT),
          selected: isBoolean(group.selected)
            ? group.selected
            : selectedCount === group.options.length,
          indeterminate: this.isIndeterminate(group.options, selectedCount),
          selectedCount,
          hasCheckbox,
          groupIsOption,
        };
      }
    );
  }

  getOptionsModel(
    options: SelectGroupOption[],
    listHeaders: ListHeader[],
    { noGroupHeaders }: GetOptionsModelConfig
  ): ListOption[] {
    const groupOptions = options.map(
      (group: SelectGroupOption, groupIndex: number) => {
        const placeholder = {
          isPlaceHolder: true,
          selected: false,
        };

        let virtualOptions: Partial<ListOption>[];

        if (noGroupHeaders) {
          virtualOptions = group.options.map((option) => ({
            ...option,
            groupName: group.groupName,
            key: this.getGroupKey(group),
            groupIndex: isNumber(group.groupIndex)
              ? group.groupIndex
              : groupIndex,
            isPlaceHolder: false,
          }));
        } else if (
          listHeaders[groupIndex].isCollapsed ||
          listHeaders[groupIndex].groupIsOption
        ) {
          virtualOptions = [placeholder];
        } else {
          virtualOptions = [].concat(
            placeholder,
            group.options.map((option) => ({
              ...option,
              groupName: group.groupName,
              key: this.getGroupKey(group),
              groupIndex: isNumber(group.groupIndex)
                ? group.groupIndex
                : groupIndex,
              isPlaceHolder: false,
            }))
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
    selectedIDs: itemID[] = null
  ): void {
    selectedIDs = selectedIDs || this.getSelectedIDs(options);

    listOptions.forEach((option: ListOption) => {
      option.selected = option.isPlaceHolder
        ? false
        : selectedIDs.includes(option.id);
    });

    listHeaders.forEach((header: ListHeader, index: number) => {
      const groupOptions = (
        options[header.groupIndex] ||
        options.find(
          (group) =>
            group.key === header.key || group.groupName === header.groupName
        )
      ).options;

      header.selectedCount = this.countOptions(groupOptions, 'selected');
      header.selected = header.selectedCount === groupOptions.length;
      header.indeterminate = this.isIndeterminate(
        groupOptions,
        header.selectedCount
      );
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

  getSelectedIDs(options: SelectGroupOption[], mustBe = 'selected'): itemID[] {
    if (isEmptyArray(options)) {
      return [];
    }
    return arrayFlatten<itemID>(
      options.map((group) =>
        group.options
          .filter((option: SelectOption) => option.selected && option[mustBe])
          .map((opt: SelectOption) => opt.id)
      )
    );
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
    options.forEach((option) => {
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

  countOptions(options: SelectOption[], mustBe = null) {
    return mustBe
      ? options.filter((opt) => opt[mustBe]).length
      : options.length;
  }

  isIndeterminate(options: SelectOption[], selectedCount = null): boolean {
    selectedCount =
      selectedCount !== null
        ? selectedCount
        : this.countOptions(options, 'selected');
    return selectedCount > 0 && selectedCount < options.length;
  }

  totalOptionsCount(options: SelectGroupOption[]): number {
    return arrayFlatten(options.map((group) => group.options)).length;
  }

  getGroupKey(group: SelectGroupOption | ListHeader): string {
    return group.key
      ? group.key + ''
      : `${isNumber(group.groupIndex) ? group.groupIndex + '__' : ''}${
          group.groupName
        }`;
  }
}

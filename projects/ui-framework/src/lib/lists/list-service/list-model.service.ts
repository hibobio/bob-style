import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import {
  LIST_EL_HEIGHT,
  LIST_FOOTER_HEIGHT,
  SELECT_MAX_ITEMS,
} from '../list.consts';
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
  normalizeString,
  getMatcher,
} from '../../services/utils/functional-utils';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { FORM_ELEMENT_HEIGHT } from '../../form-elements/form-elements.const';
import { Icon } from '../../icons/icon.interface';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { Avatar } from '../../avatar/avatar/avatar.interface';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';

interface GetHeadersModelConfig {
  collapseHeaders?: boolean;
  hasCheckbox?: boolean;
  allowGroupIsOption?: boolean;
  size?: FormElementSize;
}

interface GetOptionsModelConfig {
  noGroupHeaders?: boolean;
  size?: FormElementSize;
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
      (group, groupIndex: number): ListHeader => {
        const selectedCount = this.countOptions(group.options, 'selected');

        const groupIsOption =
          allowGroupIsOption &&
          group.optionsCount === 1 &&
          group.options[0].value === group.groupName;

        group.groupIndex = isNumber(group.groupIndex)
          ? group.groupIndex
          : groupIndex;
        group.key = this.getGroupKey(group);

        return {
          ...objectRemoveKey(group, 'options'),
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

  private mapSelectOptionToListOption({
    group,
    option,
    groupIndex,
    size,
  }: {
    group: SelectGroupOption;
    option: SelectOption;
    groupIndex: number;
    size: FormElementSize;
  }): ListOption {
    const avatar = this.getOptionAvatar(option, size);
    const opt: ListOption = {
      ...option,
      groupName: group.groupName,
      key: this.getGroupKey(group),
      groupIndex: isNumber(group.groupIndex) ? group.groupIndex : groupIndex,
      isPlaceHolder: false,
      ...(avatar && { avatar }),
    };

    if (avatar) {
      option.avatar = avatar;
    }

    return opt;
  }

  getOptionsModel(
    options: SelectGroupOption[],
    listHeaders: ListHeader[],
    { noGroupHeaders, size = FormElementSize.regular }: GetOptionsModelConfig
  ): ListOption[] {
    const groupOptions = options.map(
      (group: SelectGroupOption, groupIndex: number) => {
        const placeholder = {
          isPlaceHolder: true,
          selected: false,
        };

        let virtualOptions: Partial<ListOption>[];

        if (noGroupHeaders) {
          virtualOptions = group.options.map((option) => {
            return this.mapSelectOptionToListOption({
              group,
              option,
              groupIndex,
              size,
            });
          });
        } else if (
          listHeaders[groupIndex].isCollapsed ||
          listHeaders[groupIndex].groupIsOption
        ) {
          virtualOptions = [placeholder];
        } else {
          virtualOptions = [].concat(
            placeholder,
            group.options.map((option) => {
              return this.mapSelectOptionToListOption({
                group,
                option,
                groupIndex,
                size,
              });
            })
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
    const matcher = getMatcher(searchValue);

    return searchValue
      ? options
          .map((group: SelectGroupOption) =>
            Object.assign({}, group, {
              options: group.options.filter((option: SelectOption) =>
                matcher.test(normalizeString(option.value))
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
    return arrayFlatten<SelectOption>(options.map((group) => group.options))
      .length;
  }

  getGroupKey(group: SelectGroupOption | ListHeader): string {
    return (
      group.key ||
      `${isNumber(group.groupIndex) ? group.groupIndex + '__' : ''}${
        group.groupName
      }`
    );
  }

  getOptionIcon(
    option: Partial<SelectOption>,
    size: FormElementSize,
    color: IconColor = IconColor.dark
  ): Icon {
    const optionIcon: Icon | Icons =
      option?.icon || option?.prefixComponent?.attributes?.icon;
    const iconSize =
      size === FormElementSize.smaller ? IconSize.medium : IconSize.large;

    return !optionIcon
      ? undefined
      : (optionIcon as Icon).icon
      ? {
          ...(optionIcon as Icon),
          size: iconSize,
          color,
        }
      : {
          icon: optionIcon as Icons,
          size: iconSize,
          color,
        };
  }

  getOptionAvatar(
    option: SelectOption,
    size: FormElementSize,
    backgroundColor = 'transparent'
  ): Avatar {
    const prefixComponent = option?.prefixComponent?.attributes;
    let optionAvatar: Avatar =
      option?.avatar ||
      ((prefixComponent?.imageSource || prefixComponent?.icon) &&
        prefixComponent);

    optionAvatar = optionAvatar && {
      ...optionAvatar,
      imageSource: optionAvatar.imageSource || null,
      icon: this.getOptionIcon(option, size) || null,
      size:
        size === FormElementSize.smaller ? AvatarSize.micro : AvatarSize.mini,
      border: size !== FormElementSize.smaller,
      backgroundColor,
    };

    return optionAvatar;
  }

  processMaxHeight({
    maxHeight,
    size = FormElementSize.regular,
    hasFooter = true,
    shouldDisplaySearch = true,
  }: {
    maxHeight: number;
    size?: FormElementSize;
    hasFooter?: boolean;
    shouldDisplaySearch?: boolean;
  }): {
    listMaxHeight: number;
    maxHeightItems: number;
    maxHeight: number;
  } {
    const maxHeightDef =
      FORM_ELEMENT_HEIGHT[size] * SELECT_MAX_ITEMS +
      LIST_FOOTER_HEIGHT[size] +
      FORM_ELEMENT_HEIGHT[size];

    const formElSize = FORM_ELEMENT_HEIGHT[size];
    const extrasSize =
      (hasFooter ? LIST_FOOTER_HEIGHT[size] : 0) +
      (shouldDisplaySearch ? formElSize : 0);

    let listMaxHeight = (maxHeight || maxHeightDef) - extrasSize;

    const maxHeightItems = Math.max(
      Math.floor(listMaxHeight / formElSize),
      SELECT_MAX_ITEMS
    );

    listMaxHeight = maxHeightItems * formElSize;
    maxHeight = listMaxHeight + extrasSize;

    return { maxHeightItems, listMaxHeight, maxHeight };
  }

  enrichIncomingOptions(options: SelectGroupOption[]): SelectGroupOption[] {
    let index = -1;
    return options.reduce(
      (grOpts: SelectGroupOption[], group: SelectGroupOption) => {
        if (isNotEmptyArray(group?.options)) {
          const gr = {
            ...group,
            groupIndex: ++index,
            optionsCount: group.options.length,
          };
          gr.key = this.getGroupKey(gr);

          grOpts.push(gr);
        }
        return grOpts;
      },
      []
    );
  }
}

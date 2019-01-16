import { Injectable } from '@angular/core';
import { SelectGroupOption, SelectionGroupOption, SelectionOption } from './select.interface';
import { map, assign, find, isEqual, chain, filter, includes, flatMap, every, get, concat } from 'lodash';

@Injectable()
export class SelectModelService {
  constructor() {
  }

  public getSelectElementOptionsModel(
    options: SelectGroupOption[],
  ): SelectionGroupOption[] {
    return map(options, (group) => {
      return {
        groupName: group.groupName,
        isCollapsed: false,
        groupHeader: {
          groupName: group.groupName,
          value: group.groupName,
          id: group.groupName,
          isGroupHeader: true,
        },
        options: map(group.options, option => assign(
          option,
          {
            groupName: group.groupName,
            isGroupHeader: false,
          },
        )),
      };
    });
  }

  public isOptionSelected(
    selectedOption: SelectionOption,
    selectedModel: SelectionOption[],
  ): boolean {
    return includes(flatMap(selectedModel, 'id'), get(selectedOption, 'id'));
  }

  public getSelectedOptions(
    selectionGroupOptions: SelectGroupOption[],
    selectedIds: (string | number)[],
  ): SelectionOption[] {
    return chain(selectionGroupOptions)
      .concat(flatMap(selectionGroupOptions, 'groupHeader'), flatMap(selectionGroupOptions, 'options'))
      .filter(option => includes(selectedIds, option.id))
      .value();
  }

  public getSelectedGroupHeaderOptions(
    selectionGroupOptions: SelectGroupOption[],
    selectedIds: (string | number)[],
  ): SelectionOption[] {
    return chain(selectionGroupOptions)
      .filter(group => this.isEveryGroupOptionSelected(group.options, selectedIds))
      .map('groupHeader')
      .value();
  }

  public updateGroupHeaderSelectionByOptions(
    selectionGroupOptions: SelectGroupOption[],
    selectedModel: SelectionOption[],
  ): SelectionOption[] {
    const groupHeaderIds = flatMap(selectionGroupOptions, 'groupHeader.id');
    const selectedModelNoHeaders = filter(selectedModel, option => !includes(groupHeaderIds, option.id));
    const selectedGroups = this
      .getSelectedGroupHeaderOptions(selectionGroupOptions, flatMap(selectedModelNoHeaders, 'id'));
    return concat(selectedModelNoHeaders, selectedGroups);
  }

  public selectAllGroupOptions(
    selectedOption: SelectionOption,
    selectionGroupOptions: SelectionGroupOption[],
    selectedModel: SelectionOption[],
  ): SelectionOption[] {
    const selectedGroup = find(selectionGroupOptions, group => isEqual(selectedOption.groupName, group.groupName));
    return chain([])
      .concat(selectedModel, selectedGroup.options, selectedOption)
      .uniq()
      .value();
  }

  public unselectAllGroupOptions(
    selectedOption: SelectionOption,
    selectionGroupOptions: SelectionGroupOption[],
    selectedModel: SelectionOption[],
  ): SelectionOption[] {
    const selectedGroup = find(selectionGroupOptions, group => isEqual(selectedOption.groupName, group.groupName));
    const groupIds = chain(selectedGroup.options)
      .concat(selectedGroup.groupHeader)
      .flatMap('id')
      .value();
    return filter(selectedModel, option => !includes(groupIds, option.id));
  }

  private isEveryGroupOptionSelected(
    groupOptions: SelectionOption[],
    selectedIds: (string | number)[],
  ): boolean {
    return every(groupOptions, option => includes(selectedIds, option.id));
  }
}

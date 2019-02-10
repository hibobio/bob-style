import { Injectable } from '@angular/core';
import { SelectGroupOption } from '../../select';
import { flatten, forEach, map, concat, assign, find, set, includes, filter, every } from 'lodash';
import { LIST_EL_HEIGHT } from '../list.consts';

@Injectable()
export class ListModelService {
  constructor() {
  }

  getOptionsModel(
    options: SelectGroupOption[],
    listHeaders: any,
  ): any {
    const groupOptions = map(options, (group) => {
      const groupHeaderModel = find(listHeaders, header => header.groupName === group.groupName);
      const placeholder = {
        isPlaceHolder: true,
        groupName: group.groupName,
        value: group.groupName,
        id: group.groupName,
      };
      return groupHeaderModel.isCollapsed
        ? placeholder
        : concat(
          placeholder,
          map(group.options, option => assign(
            option,
            { groupName: group.groupName, isPlaceHolder: false },
          )),
        );
    });
    return flatten(groupOptions);
  }

  getHeadersModel(options: SelectGroupOption[]): any {
    const groupHeaders = map(options, (group) => {
      return {
        groupName: group.groupName,
        isCollapsed: false,
        placeHolderSize: group.options.length * LIST_EL_HEIGHT,
      };
    });
    return groupHeaders;
  }

  setSelectedOptions(
    listHeaders: any,
    listOptions: any,
    selectedValues: (string | number)[],
  ): any {
    forEach(listOptions, option => {
      set(option, 'selected', includes(selectedValues, option.id));
    });
    forEach(listHeaders, header => {
      const groupOptions = filter(listOptions, option =>
        option.groupName === header.groupName &&
        !option.isPlaceHolder);
      set(header, 'selected', every(groupOptions, ['selected', true]));
    });
  }
}

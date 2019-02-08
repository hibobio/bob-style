import { Injectable } from '@angular/core';
import { SelectGroupOption } from '../../select';
import map from 'lodash/map';
import concat from 'lodash/concat';
import flatten from 'lodash/flatten';
import assign from 'lodash/assign';
import find from 'lodash/find';

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
        groupHeader: true,
        groupName: group.groupName,
        value: group.groupName,
        id: group.groupName,
      };
      return groupHeaderModel.isCollapsed
        ? placeholder
        : concat(
          placeholder,
          map(group.options, option => assign(option, { groupName: group.groupName, groupHeader: false })),
        );
    });
    return flatten(groupOptions);
  }

  getHeadersModel(options: SelectGroupOption[]): any {
    const groupHeaders = map(options, (group) => {
      return {
        groupName: group.groupName,
        isCollapsed: false,
        placeHolderSize: group.options.length * 44,
      };
    });
    return groupHeaders;
  }
}

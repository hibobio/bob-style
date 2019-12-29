import { Injectable } from '@angular/core';
import {
  simpleUID,
  arrOfObjSortByProp,
} from '../../services/utils/functional-utils';
import { DropResult } from 'ngx-smooth-dnd';

import { SelectOption } from '../list.interface';
import { ListSortType } from './editable-list.enum';

@Injectable()
export class EditableListService {
  constructor() {}

  onDrop(list: SelectOption[], dropResult: DropResult): SelectOption[] {
    const { removedIndex, addedIndex } = dropResult;
    if (removedIndex === addedIndex) {
      return null;
    }

    list.splice(addedIndex, 0, list.splice(removedIndex, 1)[0]);
    return list;
  }

  addItem(list: SelectOption[], value: string): SelectOption[] {
    if (value) {
      list.unshift({
        id: simpleUID('new-'),
        value: value,
      });
    }
    return list;
  }

  sortList(
    list: SelectOption[],
    order: ListSortType = null,
    currentOrder: ListSortType = null
  ): ListSortType {
    if (order === ListSortType.UserDefined) {
      return ListSortType.UserDefined;
    }

    arrOfObjSortByProp(
      list,
      'value',
      order === ListSortType.Asc ||
        (!order  && currentOrder && currentOrder !== ListSortType.Asc)
    );

    return order === ListSortType.Asc ||
      (!order  && currentOrder && currentOrder !== ListSortType.Asc)
      ? ListSortType.Asc
      : ListSortType.Desc;
  }

  isListAscending(list: SelectOption[]): boolean {
    const length = list.length;
    return !list.find(
      (itm, indx) =>
        indx + 2 <= length && list[indx].value > list[indx + 1].value
    );
  }

  isListDescending(list: SelectOption[]): boolean {
    const length = list.length;
    return !list.find(
      (itm, indx) =>
        indx + 2 <= length && list[indx].value < list[indx + 1].value
    );
  }

  getListSortType(list: SelectOption[]): ListSortType {
    return this.isListAscending(list)
      ? ListSortType.Asc
      : this.isListDescending(list)
      ? ListSortType.Desc
      : ListSortType.UserDefined;
  }
}

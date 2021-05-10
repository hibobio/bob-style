import { arrOfObjSortByProp } from '../../services/utils/functional-utils';
import { SelectOption } from '../list.interface';
import { ListSortType } from './editable-list.enum';

export class EditableListUtils {
  //

  public static sortList(
    list: SelectOption[],
    order: ListSortType = null,
    currentOrder: ListSortType = null
  ): ListSortType {
    if (order === ListSortType.UserDefined) {
      return ListSortType.UserDefined;
    }

    const shouldBeAscending =
      order === ListSortType.Asc ||
      (!order && currentOrder && currentOrder !== ListSortType.Asc) ||
      (!order && !currentOrder && !this.isListAscending(list));

    arrOfObjSortByProp(list, 'value', shouldBeAscending ? 'asc' : 'desc');

    return shouldBeAscending ? ListSortType.Asc : ListSortType.Desc;
  }

  public static isListAscending(list: SelectOption[]): boolean {
    const length = list.length;
    return !list.find(
      (itm, indx) =>
        indx + 2 <= length && list[indx].value > list[indx + 1].value
    );
  }

  public static isListDescending(list: SelectOption[]): boolean {
    const length = list.length;
    return !list.find(
      (itm, indx) =>
        indx + 2 <= length && list[indx].value < list[indx + 1].value
    );
  }

  public static getListSortType(list: SelectOption[]): ListSortType {
    const result = this.isListAscending(list)
      ? ListSortType.Asc
      : this.isListDescending(list)
      ? ListSortType.Desc
      : ListSortType.UserDefined;
    return result;
  }
}

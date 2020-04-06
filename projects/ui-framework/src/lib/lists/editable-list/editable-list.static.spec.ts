import { cloneDeep } from 'lodash';
import { ListSortType } from './editable-list.enum';
import { EditableListUtils } from './editable-list.static';

const stringOrder = (list: any[]): string => list.map((i) => i.value).join('');

describe('DateParseService', () => {
  const service = EditableListUtils;

  const ascList = [
    { id: 34, value: 'A' },
    { id: 78, value: 'D' },
    { id: 10, value: 'M' },
  ];

  const descList = [
    { id: 55, value: 'Z' },
    { id: 13, value: 'M' },
    { id: 89, value: 'A' },
  ];

  const custList = [
    { id: 45, value: 'M' },
    { id: 3, value: 'C' },
    { id: 16, value: 'T' },
  ];

  describe('addItem', () => {
    it('should insert item in the beginning of list', () => {
      const list = cloneDeep(ascList);
      const result = service.addItem(list, 'NEW ITEM');
      expect(result[0].value).toEqual('NEW ITEM');
    });
  });

  describe('isListAscending', () => {
    it('should return true for ascening list', () => {
      expect(service.isListAscending(cloneDeep(ascList))).toEqual(true);
    });
    it('should return false for descending list', () => {
      expect(service.isListAscending(cloneDeep(descList))).toEqual(false);
    });
    it('should return false for custom sorted list', () => {
      expect(service.isListAscending(cloneDeep(custList))).toEqual(false);
    });
  });

  describe('isListDescending', () => {
    it('should return true for descending list', () => {
      expect(service.isListDescending(cloneDeep(descList))).toEqual(true);
    });
    it('should return false for ascening list', () => {
      expect(service.isListDescending(cloneDeep(ascList))).toEqual(false);
    });
    it('should return false for custom sorted list', () => {
      expect(service.isListDescending(cloneDeep(custList))).toEqual(false);
    });
  });

  describe('getListSortType', () => {
    it('should return Asc for ascening list', () => {
      expect(service.getListSortType(cloneDeep(ascList))).toEqual(
        ListSortType.Asc
      );
    });
    it('should return Desc for descending list', () => {
      expect(service.getListSortType(cloneDeep(descList))).toEqual(
        ListSortType.Desc
      );
    });
    it('should return UserDefined for unsorted list', () => {
      expect(service.getListSortType(cloneDeep(custList))).toEqual(
        ListSortType.UserDefined
      );
    });
  });

  describe('sortList', () => {
    it('should leave the list unchanged, if Userdefined order is requested', () => {
      const list = cloneDeep(descList);
      const returned = service.sortList(
        list,
        ListSortType.UserDefined,
        ListSortType.Desc
      );
      expect(returned).toEqual(ListSortType.UserDefined);
      expect(list).toEqual(descList);
    });

    it('should sort a desc list ascending, when Asc is requested', () => {
      const list = cloneDeep(descList);
      const returned = service.sortList(list, ListSortType.Asc);
      expect(returned).toEqual(ListSortType.Asc);
      expect(stringOrder(list)).toEqual('AMZ');
    });

    it('should sort a custom sorted list descending, when Desc is requested', () => {
      const list = cloneDeep(custList);
      const returned = service.sortList(list, ListSortType.Desc);
      expect(returned).toEqual(ListSortType.Desc);
      expect(stringOrder(list)).toEqual('TMC');
    });

    it('should sort a custom sorted list ascending, when Desc is requested', () => {
      const list = cloneDeep(custList);
      const returned = service.sortList(list, ListSortType.Asc);
      expect(returned).toEqual(ListSortType.Asc);
      expect(stringOrder(list)).toEqual('CMT');
    });

    it('should sort custom sorted list ascending, when no additional arguments passed', () => {
      const list = cloneDeep(custList);
      const returned = service.sortList(list);
      expect(returned).toEqual(ListSortType.Asc);
      expect(stringOrder(list)).toEqual('CMT');
    });

    it('should sort ascending list descending, when no additional arguments passed', () => {
      const list = cloneDeep(ascList);
      const returned = service.sortList(list);
      expect(returned).toEqual(ListSortType.Desc);
      expect(stringOrder(list)).toEqual('MDA');
    });

    it('should sort descending list ascending, when no additional arguments passed', () => {
      const list = cloneDeep(descList);
      const returned = service.sortList(list);
      expect(returned).toEqual(ListSortType.Asc);
      expect(stringOrder(list)).toEqual('AMZ');
    });

    it('should sort Asc list ascending, when passing currentOrder = Userdefined', () => {
      const list = cloneDeep(ascList);
      const returned = service.sortList(list, null, ListSortType.UserDefined);
      expect(returned).toEqual(ListSortType.Asc);
      expect(stringOrder(list)).toEqual('ADM');
    });

    it('should sort Desc list ascending, when passing currentOrder = Userdefined', () => {
      const list = cloneDeep(descList);
      const returned = service.sortList(list, null, ListSortType.UserDefined);
      expect(returned).toEqual(ListSortType.Asc);
      expect(stringOrder(list)).toEqual('AMZ');
    });

    it('should sort custom sorted list descending, when passing currentOrder = Asc', () => {
      const list = cloneDeep(custList);
      const returned = service.sortList(list, null, ListSortType.Asc);
      expect(returned).toEqual(ListSortType.Desc);
      expect(stringOrder(list)).toEqual('TMC');
    });

    it('should sort custom sorted list ascending, when passing currentOrder = Desc', () => {
      const list = cloneDeep(custList);
      const returned = service.sortList(list, null, ListSortType.Desc);
      expect(returned).toEqual(ListSortType.Asc);
      expect(stringOrder(list)).toEqual('CMT');
    });
  });
});

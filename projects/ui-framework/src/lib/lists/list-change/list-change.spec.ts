import { SelectGroupOption } from '../list.interface';
import { ListChange } from './list-change';

describe('ListChange', () => {
  let listChange: ListChange;
  let optionsMock: SelectGroupOption[];

  beforeEach(() => {
    optionsMock = [
      {
        groupName: 'Basic Info',
        key: 1,
        options: [
          { value: 'Basic Info 1', id: 1, selected: false },
          { value: 'Basic Info 2', id: 2, selected: false },
        ],
      },
      {
        groupName: 'Personal',
        options: [
          { value: 'Personal 1', id: 11, selected: false },
          { value: 'Personal 2', id: 12, selected: false },
        ],
      },
    ];
  });

  describe('getSelectGroupOptions', () => {
    it('should return getSelectGroupOptions model', () => {
      listChange = new ListChange(optionsMock);
      expect(listChange.getSelectGroupOptions()).toEqual(optionsMock);
    });
  });

  describe('getSelectedIds', () => {
    it('should return empty array when non are selected', () => {
      listChange = new ListChange(optionsMock);
      expect(listChange.getSelectedIds()).toEqual([]);
    });
    it('should return flat ids map', () => {
      optionsMock[0].options[0].selected = true;
      optionsMock[1].options[0].selected = true;
      listChange = new ListChange(optionsMock);
      expect(listChange.getSelectedIds()).toEqual([1, 11]);
    });
  });

  describe('getSelectedGroupOptions', () => {
    it('should return empty array when non are selected', () => {
      listChange = new ListChange(optionsMock);
      expect(listChange.getSelectedGroupOptions()).toEqual([]);
    });
    it('should return selected option ids with group name', () => {
      optionsMock[0].options[0].selected = true;
      listChange = new ListChange(optionsMock);
      expect(listChange.getSelectedGroupOptions()).toEqual([
        {
          groupName: 'Basic Info',
          key: 1,
          groupSelectedIDs: [1],
          groupSelectedValues: ['Basic Info 1'],
          selectedCount: 1,

          options: [{ value: 'Basic Info 1', id: 1, selected: true }],
        },
      ]);
    });
  });
});

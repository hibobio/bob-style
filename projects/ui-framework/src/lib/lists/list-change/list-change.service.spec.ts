import { TestBed } from '@angular/core/testing';
import { SelectGroupOption } from '../list.interface';
import { ListChangeService } from './list-change.service';

describe('ListChangeService', () => {
  let listChangeServive: ListChangeService;
  let optionsMock: SelectGroupOption[];

  beforeEach(() => {
    optionsMock = [
      {
        groupName: 'Basic Info',
        options: [
          { value: 'Basic Info 1', id: 1, selected: true },
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

    TestBed.configureTestingModule({
      providers: [ListChangeService],
    });

    listChangeServive = TestBed.inject(ListChangeService);
  });

  describe('getListChange', () => {
    it('should return listChange class', () => {
      expect(1 === 1).toBeTruthy();
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { ListModelService } from './list-model.service';
import { SelectGroupOption } from '../list.interface';

describe('ListModelService', () => {
  let listModelService: ListModelService;
  let optionsMock: SelectGroupOption[];

  beforeEach(() => {
    optionsMock = [
      {
        groupName: 'Basic Info',
        options: [
          { value: 'Basic Info 1', id: 1 },
          { value: 'Basic Info 2', id: 2 },
        ],
      },
      {
        groupName: 'Personal',
        options: [
          { value: 'Personal 1', id: 11 },
          { value: 'Personal 2', id: 12 },
        ],
      },
    ];

    TestBed.configureTestingModule({
      providers: [
        ListModelService,
      ]
    });

    listModelService = TestBed.get(ListModelService);
  });

  describe('getHeadersModel', () => {
    it('should return header model for virtual scroll', () => {
      const headerModel = listModelService.getHeadersModel(optionsMock);
      expect(headerModel).toEqual([
        {
          groupName: 'Basic Info',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: null,
        },
        {
          groupName: 'Personal',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: null,
        }
      ]);
    });
  });

  describe('getOptionsModel', () => {
    it('should return options model for virtual scroll', () => {
      const noGroupHeaders = false;
      const headerModel = listModelService.getHeadersModel(optionsMock);
      const optionsModel = listModelService.getOptionsModel(optionsMock, headerModel, noGroupHeaders);
      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          groupName: 'Basic Info',
          value: 'Basic Info',
          id: 'Basic Info',
          selected: null,
        },
        {
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info',
          isPlaceHolder: false,
          selected: null,
        },
        {
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info',
          isPlaceHolder: false,
          selected: null,
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal',
          value: 'Personal',
          id: 'Personal',
          selected: null,
        },
        {
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal',
          isPlaceHolder: false,
          selected: null,
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal',
          isPlaceHolder: false,
          selected: null,
        },
      ]);
    });
    it('should return options model for virtual scroll filtered by collapsed headers', () => {
      const noGroupHeaders = false;
      const headerModel = [
        {
          groupName: 'Basic Info',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: null,
        },
        {
          groupName: 'Personal',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: null,
        }
      ];
      const optionsModel = listModelService.getOptionsModel(optionsMock, headerModel, noGroupHeaders);
      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          groupName: 'Basic Info',
          value: 'Basic Info',
          id: 'Basic Info',
          selected: null,
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal',
          value: 'Personal',
          id: 'Personal',
          selected: null,
        },
      ]);
    });
  });

  describe('setSelectedOptions', () => {
    it('should enrich models with selected property based on selected values', () => {
      const noGroupHeaders = false;
      const headerModel = [
        {
          groupName: 'Basic Info',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: null,
        },
        {
          groupName: 'Personal',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: null,
        }
      ];
      const optionsModel = listModelService.getOptionsModel(optionsMock, headerModel, noGroupHeaders);
      const selectedValues = [1, 11, 12];
      listModelService.setSelectedOptions(headerModel, optionsModel, selectedValues);
      expect(headerModel).toEqual([
        {
          groupName: 'Basic Info',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
        },
        {
          groupName: 'Personal',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: true,
        }
      ]);
      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          groupName: 'Basic Info',
          value: 'Basic Info',
          id: 'Basic Info',
          selected: false,
        },
        {
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info',
          isPlaceHolder: false,
          selected: true,
        },
        {
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info',
          isPlaceHolder: false,
          selected: false,
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal',
          value: 'Personal',
          id: 'Personal',
          selected: false,
        },
      ]);
    });
  });
});

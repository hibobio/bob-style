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
          { value: 'Basic Info 1', id: 1, selected: true },
          { value: 'Basic Info 2', id: 2, selected: false }
        ]
      },
      {
        groupName: 'Personal',
        options: [
          { value: 'Personal 1', id: 11, selected: false },
          { value: 'Personal 2', id: 12, selected: false }
        ]
      }
    ];

    TestBed.configureTestingModule({
      providers: [ListModelService]
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
          indeterminate: true,
        },
        {
          groupName: 'Personal',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: null,
          indeterminate: false,
        }
      ]);
    });
    it('should set header indeterminate to true if some of the options are disabled and selected', () => {
      optionsMock[1].options[0].selected = true;
      optionsMock[1].options[0].disabled = true;
      const headerModel = listModelService.getHeadersModel(optionsMock);
      expect(headerModel[1].indeterminate).toEqual(true);
    });
    it('should set header disabled to false if option is disabled and not selected', () => {
      optionsMock[1].options[0].disabled = true;
      optionsMock[1].options[0].selected = false;
      const headerModel = listModelService.getHeadersModel(optionsMock);
      expect(headerModel[1].indeterminate).toEqual(false);
    });
  });

  describe('getOptionsModel', () => {
    it('should return options model for virtual scroll', () => {
      const noGroupHeaders = false;
      const headerModel = listModelService.getHeadersModel(optionsMock);
      const optionsModel = listModelService.getOptionsModel(
        optionsMock,
        headerModel,
        noGroupHeaders
      );
      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          groupName: 'Basic Info',
          value: 'Basic Info',
          id: 'Basic Info',
          selected: null
        },
        {
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info',
          isPlaceHolder: false,
          selected: true
        },
        {
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info',
          isPlaceHolder: false,
          selected: false
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal',
          value: 'Personal',
          id: 'Personal',
          selected: null
        },
        {
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal',
          isPlaceHolder: false,
          selected: false
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal',
          isPlaceHolder: false,
          selected: false
        }
      ]);
    });
    it('should return options model for virtual scroll filtered by collapsed headers', () => {
      const noGroupHeaders = false;
      const headerModel = [
        {
          groupName: 'Basic Info',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: null
        },
        {
          groupName: 'Personal',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: null
        }
      ];
      const optionsModel = listModelService.getOptionsModel(
        optionsMock,
        headerModel,
        noGroupHeaders
      );
      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          groupName: 'Basic Info',
          value: 'Basic Info',
          id: 'Basic Info',
          selected: null
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal',
          value: 'Personal',
          id: 'Personal',
          selected: null
        }
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
          indeterminate: false,
        },
        {
          groupName: 'Personal',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: null,
          indeterminate: true,
        }
      ];
      const optionsModel = listModelService.getOptionsModel(
        optionsMock,
        headerModel,
        noGroupHeaders
      );
      const options = [{
        groupName: 'Basic Info',
        options: [
          { value: 'Basic Info 1', id: 1, selected: true },
          { value: 'Basic Info 2', id: 2, selected: false }
        ]
      },
        {
          groupName: 'Personal',
          options: [
            { value: 'Personal 1', id: 11, selected: true },
            { value: 'Personal 2', id: 12, selected: true }
          ]
        },
      ];
      listModelService.setSelectedOptions(
        headerModel,
        optionsModel,
        options,
      );
      expect(headerModel).toEqual([
        {
          groupName: 'Basic Info',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true
        },
        {
          groupName: 'Personal',
          isCollapsed: false,
          placeHolderSize: 88,
          selected: true,
          indeterminate: false,
        }
      ]);
      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          groupName: 'Basic Info',
          value: 'Basic Info',
          id: 'Basic Info',
          selected: null
        },
        {
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info',
          isPlaceHolder: false,
          selected: true
        },
        {
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info',
          isPlaceHolder: false,
          selected: false
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal',
          value: 'Personal',
          id: 'Personal',
          selected: null
        },
        {
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal',
          isPlaceHolder: false,
          selected: true
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal',
          isPlaceHolder: false,
          selected: true
        }
      ]);
    });
    it('should enrich header selected values also when header is collapsed', () => {
      const noGroupHeaders = false;
      const headerModel = [
        {
          groupName: 'Basic Info',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: true,
          indeterminate: false,
        },
        {
          groupName: 'Personal',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: true,
          indeterminate: true,
        }
      ];
      const optionsModel = listModelService.getOptionsModel(
        optionsMock,
        headerModel,
        noGroupHeaders
      );
      const options = [{
        groupName: 'Basic Info',
        options: [
          { value: 'Basic Info 1', id: 1, selected: true },
          { value: 'Basic Info 2', id: 2, selected: false }
        ]
      },
        {
          groupName: 'Personal',
          options: [
            { value: 'Personal 1', id: 11, selected: true },
            { value: 'Personal 2', id: 12, selected: true }
          ]
        },
      ];
      listModelService.setSelectedOptions(
        headerModel,
        optionsModel,
        options,
      );
      expect(headerModel).toEqual([
        {
          groupName: 'Basic Info',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true,
        },
        {
          groupName: 'Personal',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: true,
          indeterminate: false,
        }
      ]);

      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          groupName: 'Basic Info',
          value: 'Basic Info',
          id: 'Basic Info',
          selected: null
        },
        {
          isPlaceHolder: true,
          groupName: 'Personal',
          value: 'Personal',
          id: 'Personal',
          selected: null
        }
      ]);
    });
  });

  describe('getSelectedIdsMap', () => {
    it('should return empty array when no option is selected', () => {
      optionsMock[0].options[0].selected = false;
      const selectedIdsMap = listModelService.getSelectedIdsMap(optionsMock);
      expect(selectedIdsMap).toEqual([]);
    });
    it('should return array of selected Ids', () => {
      optionsMock[0].options[0].selected = true;
      optionsMock[1].options[0].selected = true;
      const selectedIdsMap = listModelService.getSelectedIdsMap(optionsMock);
      expect(selectedIdsMap).toEqual([1, 11]);
    });
  });
});

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
      providers: [ListModelService],
    });

    listModelService = TestBed.inject(ListModelService);
  });

  describe('getHeadersModel', () => {
    it('should return header model for virtual scroll', () => {
      const headerModel = listModelService.getHeadersModel(optionsMock);
      expect(headerModel).toEqual([
        {
          groupName: 'Basic Info',
          key: 'Basic Info',
          // groupIndex: 0,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true,
          selectedCount: 1,
          hasCheckbox: true,
          groupIsOption: false,
        },
        {
          groupName: 'Personal',
          key: 'Personal',
          // groupIndex: 1,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: false,
          selectedCount: 0,
          hasCheckbox: true,
          groupIsOption: false,
        },
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
        { noGroupHeaders }
      );

      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          selected: false,
        },
        {
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info',
          key: 'Basic Info',
          groupIndex: 0,
          isPlaceHolder: false,
          selected: true,
        },
        {
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info',
          key: 'Basic Info',
          isPlaceHolder: false,
          selected: false,
          groupIndex: 0,
        },
        {
          isPlaceHolder: true,
          selected: false,
        },
        {
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal',
          key: 'Personal',
          isPlaceHolder: false,
          selected: false,
          groupIndex: 1,
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal',
          key: 'Personal',
          isPlaceHolder: false,
          selected: false,
          groupIndex: 1,
        },
      ] as any);
    });
    it('should return options model for virtual scroll filtered by collapsed headers', () => {
      const noGroupHeaders = false;
      const headerModel = [
        {
          groupName: 'Basic Info',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: false,
        },
        {
          groupName: 'Personal',
          isCollapsed: true,
          placeHolderSize: 88,
          selected: false,
        },
      ];
      const optionsModel = listModelService.getOptionsModel(
        optionsMock,
        headerModel,
        { noGroupHeaders }
      );

      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          selected: false,
        },
        {
          isPlaceHolder: true,
          selected: false,
        },
      ] as any);
    });
  });

  describe('setSelectedOptions', () => {
    it('should enrich models with selected property based on selected values', () => {
      const noGroupHeaders = false;
      const headerModel = [
        {
          groupName: 'Basic Info',
          key: 'Basic Info',
          groupIndex: 0,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: false,
        },
        {
          groupName: 'Personal',
          key: 'Personal',
          groupIndex: 1,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true,
        },
      ];
      const optionsModel = listModelService.getOptionsModel(
        optionsMock,
        headerModel,
        { noGroupHeaders }
      );
      const options = [
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
            { value: 'Personal 1', id: 11, selected: true },
            { value: 'Personal 2', id: 12, selected: true },
          ],
        },
      ];
      listModelService.setSelectedOptions(headerModel, optionsModel, options);
      expect(headerModel).toEqual([
        {
          groupName: 'Basic Info',
          key: 'Basic Info',
          groupIndex: 0,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true,
          selectedCount: 1,
        },
        {
          groupName: 'Personal',
          key: 'Personal',
          groupIndex: 1,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: true,
          indeterminate: false,
          selectedCount: 2,
        },
      ] as any);

      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          selected: false,
        },
        {
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info',
          key: 'Basic Info',
          isPlaceHolder: false,
          selected: true,
          groupIndex: 0,
        },
        {
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info',
          key: 'Basic Info',
          isPlaceHolder: false,
          selected: false,
          groupIndex: 0,
        },
        {
          isPlaceHolder: true,
          selected: false,
        },
        {
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal',
          key: 'Personal',
          isPlaceHolder: false,
          selected: true,
          groupIndex: 1,
        },
        {
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal',
          key: 'Personal',
          isPlaceHolder: false,
          selected: true,
          groupIndex: 1,
        },
      ] as any);
    });
    it('should enrich header selected values also when header is collapsed', () => {
      const noGroupHeaders = false;
      const headerModel = [
        {
          groupName: 'Basic Info',
          key: 'Basic Info',
          groupIndex: 0,
          isCollapsed: true,
          placeHolderSize: 88,
          selected: true,
          indeterminate: false,
        },
        {
          groupName: 'Personal',
          key: 'Personal',
          groupIndex: 1,
          isCollapsed: true,
          placeHolderSize: 88,
          selected: true,
          indeterminate: true,
        },
      ];
      const optionsModel = listModelService.getOptionsModel(
        optionsMock,
        headerModel,
        { noGroupHeaders }
      );
      const options = [
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
            { value: 'Personal 1', id: 11, selected: true },
            { value: 'Personal 2', id: 12, selected: true },
          ],
        },
      ];
      listModelService.setSelectedOptions(headerModel, optionsModel, options);
      expect(headerModel).toEqual([
        {
          groupName: 'Basic Info',
          key: 'Basic Info',
          groupIndex: 0,
          isCollapsed: true,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true,
          selectedCount: 1,
        },
        {
          groupName: 'Personal',
          key: 'Personal',
          groupIndex: 1,
          isCollapsed: true,
          placeHolderSize: 88,
          selected: true,
          indeterminate: false,
          selectedCount: 2,
        },
      ] as any);

      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          selected: false,
        },
        {
          isPlaceHolder: true,
          selected: false,
        },
      ] as any);
    });
  });

  describe('getSelectedIDs', () => {
    it('should return empty array when no option is selected', () => {
      optionsMock[0].options[0].selected = false;
      const selectedIDs = listModelService.getSelectedIDs(optionsMock);
      expect(selectedIDs).toEqual([]);
    });
    it('should return array of selected Ids', () => {
      optionsMock[0].options[0].selected = true;
      optionsMock[1].options[0].selected = true;
      const selectedIDs = listModelService.getSelectedIDs(optionsMock);
      expect(selectedIDs).toEqual([1, 11]);
    });
  });
});

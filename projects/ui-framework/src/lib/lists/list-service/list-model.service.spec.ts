import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SelectGroupOption } from '../list.interface';
import { ListModelService } from './list-model.service';

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
      schemas: [NO_ERRORS_SCHEMA],
    });

    listModelService = TestBed.inject(ListModelService);
  });

  describe('getHeadersModel', () => {
    it('should return header model for virtual scroll', () => {
      const headerModel = listModelService.getHeadersModel(optionsMock);
      expect(headerModel).toEqual([
        jasmine.objectContaining({
          groupName: 'Basic Info',
          key: '0__Basic Info',
          groupIndex: 0,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true,
          selectedCount: 1,
          hasCheckbox: true,
          groupIsOption: false,
        }),
        jasmine.objectContaining({
          groupName: 'Personal',
          key: '1__Personal',
          groupIndex: 1,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: false,
          selectedCount: 0,
          hasCheckbox: true,
          groupIsOption: false,
        }),
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
        jasmine.objectContaining({
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info',
          key: '0__Basic Info',
          groupIndex: 0,
          isPlaceHolder: false,
          selected: true,
        }),
        jasmine.objectContaining({
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info',
          key: '0__Basic Info',
          isPlaceHolder: false,
          selected: false,
          groupIndex: 0,
        }),
        {
          isPlaceHolder: true,
          selected: false,
        },
        jasmine.objectContaining({
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal',
          key: '1__Personal',
          isPlaceHolder: false,
          selected: false,
          groupIndex: 1,
        }),
        jasmine.objectContaining({
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal',
          key: '1__Personal',
          isPlaceHolder: false,
          selected: false,
          groupIndex: 1,
        }),
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
        jasmine.objectContaining({
          groupName: 'Basic Info',
          key: 'Basic Info',
          groupIndex: 0,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true,
          selectedCount: 1,
        }),
        jasmine.objectContaining({
          groupName: 'Personal',
          key: 'Personal',
          groupIndex: 1,
          isCollapsed: false,
          placeHolderSize: 88,
          selected: true,
          indeterminate: false,
          selectedCount: 2,
        }),
      ] as any);

      expect(optionsModel).toEqual([
        {
          isPlaceHolder: true,
          selected: false,
        },
        jasmine.objectContaining({
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info',
          key: 'Basic Info',
          isPlaceHolder: false,
          selected: true,
          groupIndex: 0,
        }),
        jasmine.objectContaining({
          value: 'Basic Info 2',
          id: 2,
          groupName: 'Basic Info',
          key: 'Basic Info',
          isPlaceHolder: false,
          selected: false,
          groupIndex: 0,
        }),
        {
          isPlaceHolder: true,
          selected: false,
        },
        jasmine.objectContaining({
          value: 'Personal 1',
          id: 11,
          groupName: 'Personal',
          key: 'Personal',
          isPlaceHolder: false,
          selected: true,
          groupIndex: 1,
        }),
        jasmine.objectContaining({
          value: 'Personal 2',
          id: 12,
          groupName: 'Personal',
          key: 'Personal',
          isPlaceHolder: false,
          selected: true,
          groupIndex: 1,
        }),
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
        jasmine.objectContaining({
          groupName: 'Basic Info',
          key: 'Basic Info',
          groupIndex: 0,
          isCollapsed: true,
          placeHolderSize: 88,
          selected: false,
          indeterminate: true,
          selectedCount: 1,
        }),
        jasmine.objectContaining({
          groupName: 'Personal',
          key: 'Personal',
          groupIndex: 1,
          isCollapsed: true,
          placeHolderSize: 88,
          selected: true,
          indeterminate: false,
          selectedCount: 2,
        }),
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

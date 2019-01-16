import { SelectModelService } from './select-model.service';
import { TestBed } from '@angular/core/testing';
import { SelectGroupOption, SelectionGroupOption, SelectionOption } from './select.interface';

describe('IconService', () => {
  let selectModelService: SelectModelService;
  let optionsMock: SelectGroupOption[];
  let selectionGroupOptionsMock: SelectionGroupOption[];

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
    selectionGroupOptionsMock = [
      {
        groupName: 'Basic Info',
        isCollapsed: false,
        groupHeader: {
          groupName: 'Basic Info',
          value: 'Basic Info',
          id: 'Basic Info',
          isGroupHeader: true,
        },
        'options': [
          {
            value: 'Basic Info 1',
            id: 1,
            groupName: 'Basic Info',
            isGroupHeader: false,
          },
          {
            value: 'Basic Info 2',
            id: 2,
            groupName: 'Basic Info',
            isGroupHeader: false,
          },
        ]
      },
      {
        groupName: 'Personal',
        isCollapsed: false,
        groupHeader: {
          groupName: 'Personal',
          value: 'Personal',
          id: 'Personal',
          isGroupHeader: true,
        },
        'options': [
          {
            value: 'Personal 1',
            id: 11,
            groupName: 'Personal',
            isGroupHeader: false,
          },
          {
            value: 'Personal 2',
            id: 12,
            groupName: 'Personal',
            isGroupHeader: false
          },
        ]
      },
    ];

    TestBed.configureTestingModule({
      providers: [
        SelectModelService,
      ]
    });

    selectModelService = TestBed.get(SelectModelService);
  });
  describe('getSelectElementOptionsModel', () => {
    it('should transform SelectGroupOption model into SelectionGroupOption model', () => {
      const selectionGroupOptions: SelectionGroupOption[] = selectModelService.getSelectElementOptionsModel(optionsMock);
      expect(selectionGroupOptions).toEqual(selectionGroupOptionsMock);
    });
  });

  describe('isOptionSelected', () => {
    it('should return true if option is in the selectedModel list', () => {
      const selectedOption = selectionGroupOptionsMock[0].options[0];
      const selectedModel = [
        selectionGroupOptionsMock[0].options[0],
        selectionGroupOptionsMock[1].options[1],
      ];
      const isOptionSelected = selectModelService.isOptionSelected(selectedOption, selectedModel);
      expect(isOptionSelected).toBe(true);
    });
    it('should return false if option is not in the selectedModel list', () => {
      const selectedOption = selectionGroupOptionsMock[0].options[0];
      const selectedModel = [
        selectionGroupOptionsMock[0].options[1],
        selectionGroupOptionsMock[1].options[1],
      ];
      const isOptionSelected = selectModelService.isOptionSelected(selectedOption, selectedModel);
      expect(isOptionSelected).toBe(false);
    });
    it('should return false if option is not in the selectedModel list', () => {
      const selectedOption = selectionGroupOptionsMock[0].options[0];
      const selectedModel = [];
      const isOptionSelected = selectModelService.isOptionSelected(selectedOption, selectedModel);
      expect(isOptionSelected).toBe(false);
    });
  });

  describe('getSelectedOptions', () => {
    it('should return an array of selected ids as SelectionOption[]', () => {
      const selectedIds = [1, 12];
      const selectedOptions = selectModelService.getSelectedOptions(selectionGroupOptionsMock, selectedIds);
      expect(selectedOptions).toEqual([
        selectionGroupOptionsMock[0].options[0],
        selectionGroupOptionsMock[1].options[1],
      ]);
    });
    it('should return empty array if no ids are passed', () => {
      const selectedIds = [];
      const selectedOptions = selectModelService.getSelectedOptions(selectionGroupOptionsMock, selectedIds);
      expect(selectedOptions).toEqual([]);
    });
  });

  describe('getSelectedGroupHeaderOptions', () => {
    it('should return an array of groupHeaders as SelectionOption[] for groups that all options are selected', () => {
      const selectedIds = [1, 2, 11, 12];
      const selectedGroupHeaderOptions: SelectionOption[] = selectModelService
        .getSelectedGroupHeaderOptions(selectionGroupOptionsMock, selectedIds);
      expect(selectedGroupHeaderOptions).toEqual([
        selectionGroupOptionsMock[0].groupHeader,
        selectionGroupOptionsMock[1].groupHeader,
      ]);
    });
    it('should return an array of groupHeaders as SelectionOption[] for groups that all options are selected', () => {
      const selectedIds = [1, 2, 11];
      const selectedGroupHeaderOptions: SelectionOption[] = selectModelService
        .getSelectedGroupHeaderOptions(selectionGroupOptionsMock, selectedIds);
      expect(selectedGroupHeaderOptions).toEqual([
        selectionGroupOptionsMock[0].groupHeader,
      ]);
    });
    it('should return empty array if no groups options are all selected', () => {
      const selectedIds = [1, 11];
      const selectedGroupHeaderOptions: SelectionOption[] = selectModelService
        .getSelectedGroupHeaderOptions(selectionGroupOptionsMock, selectedIds);
      expect(selectedGroupHeaderOptions).toEqual([]);
    });
  });

  describe('updateGroupHeaderSelectionByOptions', () => {
    it('should add groupHeader to selected options if all options are selected', () => {
      const selectedModel = [
        selectionGroupOptionsMock[0].options[0],
        selectionGroupOptionsMock[0].options[1],
        selectionGroupOptionsMock[1].options[1],
      ];
      const updatedOptions = selectModelService
        .updateGroupHeaderSelectionByOptions(selectionGroupOptionsMock, selectedModel);
      expect(updatedOptions).toEqual([
        selectionGroupOptionsMock[0].options[0],
        selectionGroupOptionsMock[0].options[1],
        selectionGroupOptionsMock[1].options[1],
        selectionGroupOptionsMock[0].groupHeader,
      ]);
    });
    it('should not add groupHeader to selected options if not all options are selected', () => {
      const selectedModel = [
        selectionGroupOptionsMock[0].options[0],
        selectionGroupOptionsMock[1].options[1],
      ];
      const updatedOptions = selectModelService
        .updateGroupHeaderSelectionByOptions(selectionGroupOptionsMock, selectedModel);
      expect(updatedOptions).toEqual(selectedModel);
    });
    it('should remove groupHeader to selected options if not all options are selected', () => {
      const selectedModel = [
        selectionGroupOptionsMock[0].options[0],
        selectionGroupOptionsMock[1].options[1],
        selectionGroupOptionsMock[0].groupHeader,
      ];
      const updatedOptions = selectModelService
        .updateGroupHeaderSelectionByOptions(selectionGroupOptionsMock, selectedModel);
      expect(updatedOptions).toEqual([
        selectionGroupOptionsMock[0].options[0],
        selectionGroupOptionsMock[1].options[1],
      ]);
    });
  });

  describe('selectAllGroupOptions', () => {
    it('should add all group options and groupHeader on selectedModel', () => {
      const selectedModel = [];
      const updatedOptions = selectModelService
        .selectAllGroupOptions(selectionGroupOptionsMock[0].groupHeader, selectionGroupOptionsMock, selectedModel);
      expect(updatedOptions).toEqual([
        selectionGroupOptionsMock[0].options[0],
        selectionGroupOptionsMock[0].options[1],
        selectionGroupOptionsMock[0].groupHeader,
      ]);
    });
  });

  describe('unselectAllGroupOptions', () => {
    it('should remove all group options and groupHeader from selectedModel', () => {
      const selectedModel = [
        selectionGroupOptionsMock[0].options[0],
        selectionGroupOptionsMock[0].options[1],
        selectionGroupOptionsMock[0].groupHeader,
      ];
      const updatedOptions = selectModelService
        .unselectAllGroupOptions(selectionGroupOptionsMock[0].groupHeader, selectionGroupOptionsMock, selectedModel);
      expect(updatedOptions).toEqual([]);
    });
  });
});

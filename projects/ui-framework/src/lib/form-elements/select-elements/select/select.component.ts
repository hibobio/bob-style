import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { concat, flatMap, get, join, escapeRegExp, forEach } from 'lodash';
import { SelectGroupOption, SelectionGroupOption, SelectionOption } from '../select.interface';
import { ButtonSize, ButtonType } from '../../../buttons/buttons.enum';
import { SelectModelService } from './select-model.service';

const navigationKeys = new Set(['ArrowUp', 'ArrowDown', 'Enter']);

@Component({
  selector: 'b-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {

  @ViewChild('mySelect') mySelect;

  @Input() options: SelectGroupOption[];
  @Input() selectedIds: (string | number)[] = [];
  @Input() isMultiSelect: boolean;
  @Input() showSingleGroupHeader = false;

  @Output() selectChange: EventEmitter<(string | number)[]> = new EventEmitter<(string | number)[]>();

  selectionGroupOptions: SelectionGroupOption[];
  selectedModel: SelectionOption[] | SelectionOption;
  triggerValue: string;
  blockGroupHeaderOptionClick = false;

  buttonType = ButtonType;
  buttonSize = ButtonSize;

  constructor(
    private selectModelService: SelectModelService,
  ) {
  }

  ngOnInit(): void {
    this.selectionGroupOptions = this.selectModelService
      .getSelectElementOptionsModel(this.options);

    const selectedOptions = this.selectModelService
      .getSelectedOptions(this.selectionGroupOptions, this.selectedIds);
    const selectedGroupsHeaders = this.selectModelService
      .getSelectedGroupHeaderOptions(this.selectionGroupOptions, this.selectedIds);

    this.selectedModel = this.isMultiSelect
      ? concat(selectedOptions, selectedGroupsHeaders)
      : selectedOptions[0];

    this.updateTriggerText();
  }

  onOptionClick(selectedOption): void {
    if (this.isMultiSelect) {
      this.onMultiSelectOptionClick(selectedOption);
    } else {
      this.onSingleSelectOptionClick(selectedOption);
    }
    this.updateTriggerText();
  }

  onSearchKeyDown($event): void {
    if (!navigationKeys.has($event.code)) {
      $event.stopPropagation();
    }
  }

  onCollapseGroup(group): void {
    group.isCollapsed = !group.isCollapsed;
  }

  onSearchChange(searchVal: string): void {
    // todo: filter values by inputEvent.value
    // const matcher = new RegExp(escapeRegExp(searchVal), 'i');
    // forEach(this.selectionGroupOptions, (group) => {
    //   console.log('isMatch', group.groupHeader.value.match(matcher));
    // });
  }

  cancelSelection(): void {
    this.ngOnInit();
    this.mySelect.close();
  }

  notifySelectionIds(): void {
    const selectedIds = this.isMultiSelect
      ? this.selectModelService.getSelectedOptionIds(this.selectedModel as SelectionOption[])
      : [(this.selectedModel as SelectionOption).id];
    this.selectChange.emit(selectedIds);
    this.mySelect.close();
  }

  private onMultiSelectOptionClick(selectedOption: SelectionOption): void {
    if (selectedOption.isGroupHeader) {
      this.onGroupHeaderClick(selectedOption);
    } else {
      this.selectedModel = this.selectModelService
        .updateGroupHeaderSelectionByOptions(this.selectionGroupOptions, this.selectedModel as SelectionOption[]);
    }
  }

  private onGroupHeaderClick(selectedOption: SelectionOption): void {
    const isOptionSelected = this.selectModelService
      .isOptionSelected(selectedOption, this.selectedModel as SelectionOption[]);

    this.selectedModel = isOptionSelected
      ? this.selectModelService
        .selectAllGroupOptions(selectedOption, this.selectionGroupOptions, this.selectedModel as SelectionOption[])
      : this.selectModelService
        .unselectAllGroupOptions(selectedOption, this.selectionGroupOptions, this.selectedModel as SelectionOption[]);
  }

  private onSingleSelectOptionClick(selectedOption: SelectionOption): void {
    if (!selectedOption.isGroupHeader) {
      this.notifySelectionIds();
    }
  }

  private updateTriggerText(): void {
    this.triggerValue = this.isMultiSelect
      ? join(flatMap(this.selectedModel, 'value'), ', ')
      : get(this.selectedModel, 'value', '');
  }
}

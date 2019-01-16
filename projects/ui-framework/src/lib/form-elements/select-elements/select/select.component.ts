import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { concat, flatMap, get, join } from 'lodash';
import { InputEvent } from '../../input/input.interface';
import { SelectGroupOption, SelectionGroupOption, SelectionOption } from './select.interface';
import { ButtonSize, ButtonType } from '../../../buttons';
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

  selectionGroupOptions: SelectionGroupOption[];
  selectedModel: SelectionOption[];
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

  onSearchEvents(inputEvent: InputEvent): void {
    // todo: filter values by inputEvent.value
  }

  private onMultiSelectOptionClick(selectedOption: SelectionOption): void {
    if (selectedOption.isGroupHeader) {
      this.onGroupHeaderClick(selectedOption);
    } else {
      this.selectedModel = this.selectModelService
        .updateGroupHeaderSelectionByOptions(this.selectionGroupOptions, this.selectedModel);
    }
  }

  private onGroupHeaderClick(selectedOption: SelectionOption): void {
    const isOptionSelected = this.selectModelService
      .isOptionSelected(selectedOption, this.selectedModel);

    this.selectedModel = isOptionSelected
      ? this.selectModelService
        .selectAllGroupOptions(selectedOption, this.selectionGroupOptions, this.selectedModel)
      : this.selectModelService
        .unselectAllGroupOptions(selectedOption, this.selectionGroupOptions, this.selectedModel);
  }

  private updateTriggerText(): void {
    this.triggerValue = this.isMultiSelect
      ? join(flatMap(this.selectedModel, 'value'), ', ')
      : get(this.selectedModel, 'value', '');
  }
}

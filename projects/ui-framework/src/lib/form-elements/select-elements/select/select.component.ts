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

  selectionGroupOption: SelectionGroupOption[];
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
    this.selectionGroupOption = this.selectModelService
      .getSelectElementOptionsModel(this.options);

    const selectedOptions = this.selectModelService
      .getSelectedOptions(this.selectionGroupOption, this.selectedIds);
    const selectedGroupsHeaders = this.selectModelService
      .getSelectedGroupHeaderOptions(this.selectionGroupOption, this.selectedIds);

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

  onCollapseGroup($event, group): void {
    $event.preventDefault();
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
        .updateGroupHeaderSelectionByOptions(this.selectionGroupOption, this.selectedModel);
    }
  }

  private onGroupHeaderClick(selectedOption: SelectionOption): void {
    const isOptionSelected = this.selectModelService
      .isOptionSelected(selectedOption, this.selectedModel);

    this.selectedModel = isOptionSelected
      ? this.selectModelService
        .selectAllGroupOptions(selectedOption, this.selectionGroupOption, this.selectedModel)
      : this.selectModelService
        .removeAllGroupOptions(selectedOption, this.selectionGroupOption, this.selectedModel);
  }

  private updateTriggerText(): void {
    this.triggerValue = this.isMultiSelect
      ? join(flatMap(this.selectedModel, 'value'), ', ')
      : get(this.selectedModel, 'value', '');
  }
}

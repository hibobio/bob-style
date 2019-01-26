import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { concat, flatMap, get, join, escapeRegExp, forEach } from 'lodash';
import { SelectGroupOption, SelectionGroupOption, SelectionOption } from '../select.interface';
import { ButtonSize, ButtonType } from '../../../buttons-indicators/buttons/buttons.enum';
import { SelectModelService } from './select-model.service';
import { BaseInputElement } from '../../base-input-element';
import { IconColor, Icons, IconSize } from '../../../icons';

const navigationKeys = new Set(['ArrowUp', 'ArrowDown', 'Enter']);

@Component({
  selector: 'b-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent extends BaseInputElement implements OnInit {

  @ViewChild('mySelect') mySelect;
  @ViewChild('triggerValueText') triggerValueText;

  @Input() options: SelectGroupOption[];
  @Input() value: (string | number)[] = [];
  @Input() isMultiSelect: boolean;
  @Input() showSingleGroupHeader = false;
  @Input() label: string;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() hintMessage: string;
  @Input() errorMessage: string;

  @Output() selectChange: EventEmitter<(string | number)[]> = new EventEmitter<(string | number)[]>();

  selectionGroupOptions: SelectionGroupOption[];
  selectedModel: SelectionOption[] | SelectionOption;
  triggerValue: string;
  blockGroupHeaderOptionClick = false;
  blockSelectClick = false;
  hasEllipsis = false;
  panelClass: string;

  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;

  readonly resetIcon: String = Icons.reset_x;
  readonly iconSize: String = IconSize.small;
  readonly iconColor: String = IconColor.dark;

  constructor(
    private selectModelService: SelectModelService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.panelClass = this.isMultiSelect
      ? 'multi-select-panel'
      : 'single-select-panel';
    this.selectionGroupOptions = this.selectModelService
      .getSelectElementOptionsModel(this.options);

    const selectedOptions = this.selectModelService
      .getSelectedOptions(this.selectionGroupOptions, this.value);
    const selectedGroupsHeaders = this.selectModelService
      .getSelectedGroupHeaderOptions(this.selectionGroupOptions, this.value);

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

  clearSelection(): void {
    this.selectedModel = [];
    this.selectChange.emit([]);
    setTimeout(() => {
      this.blockSelectClick = false;
    });
  }

  cancelSelection(): void {
    this.ngOnInit();
    this.mySelect.close();
  }

  notifySelectionIds(): void {
    const value = this.isMultiSelect
      ? this.selectModelService.getSelectedOptionIds(this.selectedModel as SelectionOption[])
      : [(this.selectedModel as SelectionOption).id];
    this.selectChange.emit(value);
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
    setTimeout(() => {
      this.hasEllipsis = this.triggerValueText.nativeElement.offsetWidth < this.triggerValueText.nativeElement.scrollWidth;
    });
  }
}

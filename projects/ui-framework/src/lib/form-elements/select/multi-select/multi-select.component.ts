import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { concat, escapeRegExp, flatMap, forEach, get, join } from 'lodash';
import { SelectGroupOption, SelectionGroupOption, SelectionOption } from '../select.interface';
import { ButtonSize, ButtonType } from '../../../buttons-indicators/buttons/buttons.enum';
import { SelectModelService } from '../select-model-service/select-model.service';
import { BaseInputElement } from '../../base-input-element';
import { IconColor, Icons, IconSize } from '../../../icons';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

const navigationKeys = new Set(['ArrowUp', 'ArrowDown', 'Enter']);

@Component({
  selector: 'b-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['../select.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ],
})
export class MultiSelectComponent extends BaseInputElement implements OnInit {

  @ViewChild('mySelect') mySelect;
  @ViewChild('triggerValueText') triggerValueText;

  @Input() options: SelectGroupOption[];
  @Input() value: (string | number)[] = [];
  @Input() showSingleGroupHeader = false;

  @Output() selectChange: EventEmitter<(string | number)[]> = new EventEmitter<(string | number)[]>();

  selectionGroupOptions: SelectionGroupOption[];
  selectedModel: SelectionOption[];
  triggerValue: string;
  blockGroupHeaderOptionClick = false;
  blockSelectClick = false;
  hasEllipsis = false;
  isMultiSelect = true;

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
    this.selectionGroupOptions = this.selectModelService
      .getSelectElementOptionsModel(this.options);

    const selectedOptions = this.selectModelService
      .getSelectedOptions(this.selectionGroupOptions, this.value);
    const selectedGroupsHeaders = this.selectModelService
      .getSelectedGroupHeaderOptions(this.selectionGroupOptions, this.value);

    this.selectedModel = concat(selectedOptions, selectedGroupsHeaders);

    this.updateTriggerText();
  }

  onOptionClick(selectedOption): void {
    if (selectedOption.isGroupHeader) {
      this.onGroupHeaderClick(selectedOption);
    } else {
      this.selectedModel = this.selectModelService
        .updateGroupHeaderSelectionByOptions(this.selectionGroupOptions, this.selectedModel);
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
    const value = this.selectModelService.getSelectedOptionIds(this.selectedModel);
    this.selectChange.emit(value);
    this.mySelect.close();
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
    this.triggerValue = join(flatMap(this.selectedModel, 'value'), ', ');
    setTimeout(() => {
      this.hasEllipsis = this.triggerValueText.nativeElement.offsetWidth < this.triggerValueText.nativeElement.scrollWidth;
    });
  }
}

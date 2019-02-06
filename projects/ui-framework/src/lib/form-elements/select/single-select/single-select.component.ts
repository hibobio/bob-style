import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { concat, escapeRegExp, flatMap, forEach, get, join } from 'lodash';
import { SelectGroupOption, SelectionGroupOption, SelectionOption } from '../select.interface';
import { SelectModelService } from '../select-model-service/select-model.service';
import { BaseInputElement } from '../../base-input-element';
import { IconColor, Icons, IconSize } from '../../../icons';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../../base-form-element';

const navigationKeys = new Set(['ArrowUp', 'ArrowDown', 'Enter']);

@Component({
  selector: 'b-single-select',
  templateUrl: './single-select.component.html',
  styleUrls: ['../select.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true
    }
  ],
})
export class SingleSelectComponent extends BaseFormElement implements OnInit {

  @ViewChild('mySelect') mySelect;
  @ViewChild('triggerValueText') triggerValueText;

  @Input() options: SelectGroupOption[];
  @Input() value: (string | number);
  @Input() showSingleGroupHeader = false;

  @Output() selectChange: EventEmitter<number | string> = new EventEmitter<number | string>();

  selectionGroupOptions: SelectionGroupOption[];
  selectedModel: SelectionOption;
  triggerValue: string;
  blockGroupHeaderOptionClick = false;
  blockSelectClick = false;
  hasEllipsis = false;
  isMultiSelect = false;

  readonly resetIcon: String = Icons.reset_x;
  readonly iconSize: String = IconSize.medium;
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
      .getSelectedOptions(this.selectionGroupOptions, [this.value]);

    this.selectedModel = selectedOptions[0];

    this.updateTriggerText();
  }

  onOptionClick(selectedOption): void {
    if (!selectedOption.isGroupHeader) {
      this.notifySelectionIds();
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
    this.selectedModel = null;
    this.selectChange.emit(null);
    this.propagateChange(null);
    setTimeout(() => {
      this.blockSelectClick = false;
    });
  }

  notifySelectionIds(): void {
    const value = (this.selectedModel as SelectionOption).id;
    this.selectChange.emit(value);
    this.propagateChange(value);
    this.mySelect.close();
  }

  private updateTriggerText(): void {
    this.triggerValue = get(this.selectedModel, 'value', '');
    setTimeout(() => {
      this.hasEllipsis = this.triggerValueText.nativeElement.offsetWidth < this.triggerValueText.nativeElement.scrollWidth;
    });
  }
}

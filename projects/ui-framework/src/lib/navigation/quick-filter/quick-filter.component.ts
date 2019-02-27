import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { QuickFilterChangeEvent, QuickFilterConfig } from './quick-filter.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';
import { SingleSelectComponent } from '../../form-elements/lists/single-select/single-select.component';
import { MultiSelectComponent } from '../../form-elements/lists/multi-select/multi-select.component';

@Component({
  selector: 'b-quick-filter',
  templateUrl: './quick-filter.component.html',
  styleUrls: ['./quick-filter.component.scss'],
})
export class QuickFilterComponent implements OnChanges {

  @ViewChild('singleSelect') singleSelect: TemplateRef<SingleSelectComponent>;
  @ViewChild('multiSelect') multiSelect: TemplateRef<MultiSelectComponent>;

  @Input() quickFilterConfig: QuickFilterConfig;
  @Output() filterChange: EventEmitter<QuickFilterChangeEvent> = new EventEmitter<QuickFilterChangeEvent>();

  showSingleGroupHeader = false;
  hasValue = false;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'quickFilterConfig')) {
      this.quickFilterConfig = changes.quickFilterConfig.currentValue;
      this.hasValue = this.quickFilterConfig.selectType === QuickFilterSelectType.multiSelect
        ? !isEmpty(this.quickFilterConfig.value)
        : this.quickFilterConfig.value !== null;
    }
  }

  multiSelectChange(value: (string | number)[]): void {
    this.hasValue = value.length > 0;
    this.emitChangeEvent(value);
  }

  multiSelectModified(value: (string | number)[]): void {
    this.hasValue = value.length > 0;
  }

  singleSelectChange(value: (string | number)): void {
    this.hasValue = value !== null;
    this.emitChangeEvent(value);
  }

  public getTemplate(): TemplateRef<any> {
    const referenceElement = {
      [QuickFilterSelectType.singleSelect]: this.singleSelect,
      [QuickFilterSelectType.multiSelect]: this.multiSelect,
    };
    return referenceElement[this.quickFilterConfig.selectType];
  }

  private emitChangeEvent(value: any): void {
    this.filterChange.emit({
      label: this.quickFilterConfig.label,
      value,
    });
  }
}

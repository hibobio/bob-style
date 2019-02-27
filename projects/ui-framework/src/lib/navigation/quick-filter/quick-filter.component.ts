import { Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { QuickFilterConfig } from './quick-filter.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import isEmpty from 'lodash/isEmpty';

@Component({
  selector: 'b-quick-filter',
  templateUrl: './quick-filter.component.html',
  styleUrls: ['./quick-filter.component.scss'],
})
export class QuickFilterComponent implements OnChanges {

  @ViewChild('singleSelect') singleSelect: TemplateRef<any>;
  @ViewChild('multiSelect') multiSelect: TemplateRef<any>;

  @Input() quickFilterConfig: QuickFilterConfig;

  showSingleGroupHeader = false;
  hasValue = false;

  constructor() {
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    this.hasValue = !isEmpty(this.quickFilterConfig.value) && this.quickFilterConfig.value !== null;
  }

  multiSelectChange(value: (string | number)[]): void {
    this.hasValue = value.length > 0;
  }

  multiSelectModified(value: (string | number)[]): void {
    this.hasValue = value.length > 0;
  }

  singleSelectChange(value: (string | number)): void {
    this.hasValue = value !== null;
  }

  private getTemplate(): TemplateRef<any> {
    const referenceElement = {
      [QuickFilterSelectType.singleSelect]: this.singleSelect,
      [QuickFilterSelectType.multiSelect]: this.multiSelect,
    };
    return referenceElement[this.quickFilterConfig.selectType];
  }
}

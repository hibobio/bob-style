import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild, } from '@angular/core';
import { QuickFilterChangeEvent, QuickFilterConfig } from './quick-filter.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import has from 'lodash/has';
import { SingleSelectComponent } from '../../form-elements/lists/single-select/single-select.component';
import { MultiSelectComponent } from '../../form-elements/lists/multi-select/multi-select.component';
import { ListChange } from '../../form-elements/lists/list-change/list-change';
import { ListModelService } from '../../form-elements/lists/list-service/list-model.service';

@Component({
  selector: 'b-quick-filter',
  templateUrl: './quick-filter.component.html',
  styleUrls: ['./quick-filter.component.scss'],
})
export class QuickFilterComponent implements OnChanges {

  @ViewChild('singleSelect', { static: true }) singleSelect: TemplateRef<SingleSelectComponent>;
  @ViewChild('multiSelect', { static: true }) multiSelect: TemplateRef<MultiSelectComponent>;

  @Input() quickFilterConfig: QuickFilterConfig;
  @Output() filterChange: EventEmitter<QuickFilterChangeEvent> = new EventEmitter<QuickFilterChangeEvent>();

  showSingleGroupHeader: boolean;
  hasValue = false;

  constructor(
    private listModelService: ListModelService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'quickFilterConfig')) {
      this.quickFilterConfig = changes.quickFilterConfig.currentValue;
      this.showSingleGroupHeader = this.quickFilterConfig.showSingleGroupHeader || false;
      this.hasValue = this.listModelService.getSelectedIdsMap(this.quickFilterConfig.options).length > 0;
    }
  }

  selectChange(listChange: ListChange): void {
    this.hasValue = listChange.getSelectedIds().length > 0;
    this.emitChangeEvent(listChange);
  }

  multiSelectModified(listChange: ListChange): void {
    this.hasValue = listChange.getSelectedIds().length > 0;
  }

  public getTemplate(): TemplateRef<any> {
    const referenceElement = {
      [QuickFilterSelectType.singleSelect]: this.singleSelect,
      [QuickFilterSelectType.multiSelect]: this.multiSelect,
    };
    return referenceElement[this.quickFilterConfig.selectType];
  }

  private emitChangeEvent(listChange: ListChange): void {
    this.filterChange.emit({
      key: this.quickFilterConfig.key,
      listChange,
    });
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  QuickFilterChangeEvent,
  QuickFilterConfig,
} from './quick-filter.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import { has } from 'lodash';
import { SingleSelectComponent } from '../../lists/single-select/single-select.component';
import { MultiSelectComponent } from '../../lists/multi-select/multi-select.component';
import { ListChange } from '../../lists/list-change/list-change';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

@Component({
  selector: 'b-quick-filter',
  templateUrl: './quick-filter.component.html',
})
export class QuickFilterComponent implements OnChanges {
  @ViewChild('singleSelect', { static: true }) singleSelect: TemplateRef<
    SingleSelectComponent
  >;
  @ViewChild('multiSelect', { static: true }) multiSelect: TemplateRef<
    MultiSelectComponent
  >;

  @Input() quickFilterConfig: QuickFilterConfig;
  @Output() filterChange: EventEmitter<
    QuickFilterChangeEvent
  > = new EventEmitter<QuickFilterChangeEvent>();

  showSingleGroupHeader: boolean;
  hasValue = false;
  readonly tooltipType = TruncateTooltipType;

  constructor(private listModelService: ListModelService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'quickFilterConfig')) {
      this.quickFilterConfig = changes.quickFilterConfig.currentValue;
      this.showSingleGroupHeader =
        this.quickFilterConfig.showSingleGroupHeader || false;
      this.hasValue =
        this.listModelService.getSelectedIDs(this.quickFilterConfig.options)
          .length > 0;
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

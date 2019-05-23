import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { QuickFilterBarChangeEvent, QuickFilterChangeEvent, QuickFilterConfig } from './quick-filter.interface';
import { chain, has } from 'lodash';
import { ListChangeService } from '../../form-elements/lists/list-change/list-change.service';
import { ListModelService } from '../../form-elements/lists/list-service/list-model.service';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';

@Component({
  selector: 'b-quick-filter-bar',
  templateUrl: './quick-filter-bar.component.html',
  styleUrls: ['./quick-filter-bar.component.scss'],
})
export class QuickFilterBarComponent implements OnChanges {

  @Input() quickFilters: QuickFilterConfig[];
  @Input() showResetFilter = false;
  @Output() filtersChange: EventEmitter<QuickFilterBarChangeEvent> = new EventEmitter<QuickFilterBarChangeEvent>();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();

  quickFiltersChanges: QuickFilterBarChangeEvent = {};

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly buttonType = ButtonType;

  constructor(
    private listModelService: ListModelService,
    private listChangeService: ListChangeService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'quickFilters')) {
      this.quickFilters = changes.quickFilters.currentValue;
      this.quickFiltersChanges = chain(this.quickFilters)
        .map(qf => ({
          key: qf.key,
          listChange: this.listChangeService.getListChange(
            qf.options,
            this.listModelService.getSelectedIdsMap(qf.options),
          ),
        }))
        .keyBy('key')
        .value();
    }
  }

  onFilterChange(quickFilterChange: QuickFilterChangeEvent): void {
    this.quickFiltersChanges[quickFilterChange.key] = quickFilterChange;
    this.filtersChange.emit(this.quickFiltersChanges);
  }
}

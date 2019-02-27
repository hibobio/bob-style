import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { QuickFilterBarChangeEvent, QuickFilterChangeEvent, QuickFilterConfig } from './quick-filter.interface';
import { chain, has } from 'lodash';

@Component({
  selector: 'b-quick-filter-bar',
  templateUrl: './quick-filter-bar.component.html',
  styleUrls: ['./quick-filter-bar.component.scss'],
})
export class QuickFilterBarComponent implements OnChanges {

  @Input() quickFilters: QuickFilterConfig[];
  @Output() filtersChange: EventEmitter<QuickFilterBarChangeEvent> = new EventEmitter<QuickFilterBarChangeEvent>();

  quickFiltersChanges: QuickFilterBarChangeEvent = {};

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'quickFilters')) {
      this.quickFilters = changes.quickFilters.currentValue;
      this.quickFiltersChanges = chain(this.quickFilters)
        .keyBy('label')
        .mapValues('value')
        .value();
    }
  }

  onFilterChange(e: QuickFilterChangeEvent): void {
    this.quickFiltersChanges[e.label] = e.value;
    this.filtersChange.emit(this.quickFiltersChanges);
  }
}

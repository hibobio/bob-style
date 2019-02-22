import { Component, Input } from '@angular/core';
import { QuickFilterConfig } from './quick-filter.interface';

@Component({
  selector: 'b-quick-filter-bar',
  templateUrl: './quick-filter-bar.component.html',
  styleUrls: ['./quick-filter-bar.component.scss'],
})
export class QuickFilterBarComponent {

  @Input() quickFilters: QuickFilterConfig[];

  constructor() {
  }
}

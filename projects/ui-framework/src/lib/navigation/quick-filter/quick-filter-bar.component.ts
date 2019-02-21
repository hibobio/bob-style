import { Component, Input, OnInit } from '@angular/core';
import { QuickFilterConfig } from './quick-filter.interface';

@Component({
  selector: 'b-quick-filter-bar',
  templateUrl: './quick-filter-bar.component.html',
  styleUrls: ['./quick-filter-bar.component.scss'],
})
export class QuickFilterBarComponent implements OnInit {

  @Input() quickFilters: QuickFilterConfig[];

  constructor() {
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { MultiSearchGroupOption } from './multi-search.interface';
import { MULTI_SEARCH_KEYMAP_DEF } from './multi-search.const';

@Component({
  selector: 'b-multi-search',
  templateUrl: './multi-search.component.html',
  styleUrls: ['./multi-search.component.scss'],
})
export class MultiSearchComponent implements OnInit {
  constructor() {}

  @Input() options: MultiSearchGroupOption = [];

  readonly keyMapDef = { ...MULTI_SEARCH_KEYMAP_DEF };

  ngOnInit() {
    console.log(this.options);
  }
}

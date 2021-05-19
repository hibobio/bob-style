import { Component, ContentChild, Input, OnInit } from '@angular/core';
import { ListLayoutItemDirective } from '../list-layout-item.directive';

@Component({
  selector: 'b-list-layout',
  templateUrl: 'list-layout.component.html'
})

export class ListLayoutComponent implements OnInit {
  @ContentChild(ListLayoutItemDirective, { static: true })
  contentChild!: ListLayoutItemDirective;
  @Input() items: any[];

  constructor() { }

  ngOnInit() { }
}

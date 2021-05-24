import { Component, ContentChild, Input, OnInit } from '@angular/core';
import { ListLayoutItemDirective } from '../list-layout-item.directive';
import { ButtonType, ButtonSize } from '../../../buttons/buttons.enum';

@Component({
  selector: 'b-list-layout',
  templateUrl: 'list-layout.component.html',
  styleUrls: ['./list-layout.component.scss']
})

export class ListLayoutComponent implements OnInit {
  @ContentChild(ListLayoutItemDirective, { static: true })
  contentChild!: ListLayoutItemDirective;
  @Input() items: any[];
  showAll: boolean;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly defaultNumOfItems = 3;

  constructor() { }

  ngOnInit() { }
}

import { Component, Input, OnInit } from '@angular/core';
import { ButtonType, IconColor, Icons, MenuItem } from 'bob-style';

@Component({
  selector: 'b-table-actions-wrapper',
  templateUrl: './table-actions-wrapper.component.html',
  styleUrls: ['./table-actions-wrapper.component.scss']
})
export class TableActionsWrapperComponent implements OnInit {
  @Input() public menuItems: MenuItem[];

  public openLeft: boolean;
  readonly buttonType: ButtonType = ButtonType.tertiary;
  readonly buttonColor: IconColor = IconColor.normal;
  readonly buttonIcon: Icons = Icons.three_dots_vert;

  constructor() { }

  ngOnInit() {
  }

}

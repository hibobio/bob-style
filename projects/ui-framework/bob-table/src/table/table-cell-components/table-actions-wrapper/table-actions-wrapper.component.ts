import { Component, Input, OnInit } from '@angular/core';
import { ButtonSize, ButtonType, IconColor, Icons, MenuItem } from 'bob-style';

@Component({
  selector: 'b-table-actions-wrapper',
  templateUrl: './table-actions-wrapper.component.html',
  styleUrls: ['./table-actions-wrapper.component.scss']
})
export class TableActionsWrapperComponent implements OnInit {
  @Input() public menuItems: MenuItem[];
  @Input() public primary = true;
  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType

  public openLeft: boolean;
  readonly buttonColor: IconColor = IconColor.normal;
  readonly buttonIcon: Icons = Icons.three_dots_vert;

  constructor() { }

  ngOnInit() {
  }

}

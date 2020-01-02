import { Component, Input, OnInit } from '@angular/core';
import { ButtonSize, ButtonType, IconColor, Icons, IconSize, IconType, MenuItem } from 'bob-style';

@Component({
  selector: 'b-table-actions-wrapper',
  templateUrl: './table-actions-wrapper.component.html',
  styleUrls: ['./table-actions-wrapper.component.scss']
})
export class TableActionsWrapperComponent implements OnInit {
  @Input() menuItems: MenuItem[];
  @Input() primary = true;
  @Input() icon: Icons = null;
  @Input() iconType: IconType = IconType.circular;
  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  public openLeft: boolean;
  readonly buttonColor: IconColor = IconColor.normal;
  readonly buttonIcon: Icons = Icons.three_dots_vert;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, Input } from '@angular/core';

import {
  Button,
  ButtonSize,
  ButtonType,
  Icon,
  IconColor,
  Icons,
  IconSize,
  IconType,
  isObject,
  MenuItem,
} from 'bob-style';

@Component({
  selector: 'b-table-actions-wrapper',
  templateUrl: './table-actions-wrapper.component.html',
  styleUrls: ['./table-actions-wrapper.component.scss'],
})
export class TableActionsWrapperComponent {
  @Input() menuItems: MenuItem[];
  @Input() buttonType: ButtonType = ButtonType.primary;
  @Input() iconTooltip: string;

  public tooltipIconConfig: Icon = {
    type: IconType.circular,
    size: IconSize.medium,
    color: IconColor.normal,
    icon: null,
  };

  @Input() set icon(icon: Icons | Icon) {
    this.tooltipIconConfig = {
      ...this.tooltipIconConfig,
      ...(isObject(icon) ? icon : { icon }),
    };
  }

  get icon() {
    return this.tooltipIconConfig.icon;
  }

  public openLeft: boolean;

  public menuTriggerButton: Button = {
    type: ButtonType.tertiary,
    icon: Icons.three_dots_vert,
    color: IconColor.normal,
  };

  readonly buttonSize = ButtonSize;
}

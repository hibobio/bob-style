import {Component, Input} from '@angular/core';
import {ButtonSize, ButtonType, IconColor, Icons, IconSize, IconType, MenuItem} from 'bob-style';

@Component({
  selector: 'b-table-actions-wrapper',
  templateUrl: './table-actions-wrapper.component.html',
  styleUrls: ['./table-actions-wrapper.component.scss']
})
export class TableActionsWrapperComponent {
  @Input() menuItems: MenuItem[];
  @Input() buttonType: ButtonType = ButtonType.primary;
  @Input() icon: Icons = null;
  @Input() iconTooltip: string;
  @Input() iconType: IconType = IconType.circular;
  @Input() iconColor: IconColor = IconColor.normal;
  @Input() iconSize: IconSize = IconSize.medium;
  public openLeft: boolean;
  readonly buttonSize = ButtonSize;
  readonly squareButtonType = ButtonType;
  readonly buttonColor: IconColor = IconColor.normal;
  readonly buttonIcon: Icons = Icons.three_dots_vert;
}

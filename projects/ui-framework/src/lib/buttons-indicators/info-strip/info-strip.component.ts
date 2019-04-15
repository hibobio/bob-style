import { Component, Input } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import get from 'lodash/get';

@Component({
  selector: 'b-info-strip',
  templateUrl: './info-strip.component.html',
  styleUrls: ['./info-strip.component.scss']
})
export class InfoStripComponent {
  @Input() icon: Icons = Icons.baseline_info_icon;
  @Input() iconColor: IconColor = IconColor.inform;
  @Input() text = '';
  @Input() linkText = '';
  @Input() targetUrl = '';
  readonly icons = Icons;
  iconSize: String = IconSize.xLarge;

  constructor() { }

  public getIcon(): Icons {
    return get(this.icons, this.icon);
  }
}

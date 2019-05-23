import { Component, Input } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { Link } from '../../buttons-indicators/link/link.types';

@Component({
  selector: 'b-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss']
})
export class InfoTooltipComponent {
  @Input() title: string;
  @Input() text: string;
  @Input() link: Link;
  readonly iconColor: IconColor = IconColor.dark;
  readonly iconSize: IconSize = IconSize.large;
  readonly icon: Icons = Icons.baseline_info_icon;

  constructor() {}
}

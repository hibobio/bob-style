import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { Link } from '../../indicators/link/link.types';


@Component({
  selector: 'b-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss'],
})
export class InfoTooltipComponent {
  @Input() title: string;
  @Input() text: string;
  @Input() link: Link;
  @Input() icon: Icons = Icons.info_outline;
  @Input() iconSize: IconSize = IconSize.large;
  @Output() linkClicked: EventEmitter<void> = new EventEmitter<void>();

  readonly iconColor: IconColor = IconColor.dark;

  constructor() {}
}

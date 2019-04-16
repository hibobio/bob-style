import { Component, Input } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';

@Component({
  selector: 'b-info-strip',
  templateUrl: './info-strip.component.html',
  styleUrls: ['./info-strip.component.scss']
})
export class InfoStripComponent {
  @Input() icon: Icons;
  @Input() iconColor: IconColor;
  @Input() link: Link;
  @Input() text = '';
  iconSize: IconSize = IconSize.xLarge;

  constructor() { }
}

export interface Link {
  text: string;
  url: string;
}

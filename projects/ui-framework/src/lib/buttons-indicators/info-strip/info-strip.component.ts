import { Component, Input } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { Link } from './../link/link.types';

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



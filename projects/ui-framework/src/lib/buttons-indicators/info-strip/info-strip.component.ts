import { Component, Input } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';

@Component({
  selector: 'b-info-strip',
  templateUrl: './info-strip.component.html',
  styleUrls: ['./info-strip.component.scss']
})
export class InfoStripComponent {
  @Input() icon: Icons;
  @Input() iconColor;
  @Input() text = '';
  @Input() linkText = '';
  @Input() targetUrl = '';
  iconSize: String = IconSize.xLarge;

  constructor() { }
}

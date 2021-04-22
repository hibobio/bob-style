import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import { Icon } from '../../icons/icon.interface';
import { Link } from '../link/link.types';
import { INFOSTRIP_ICON_DICT } from './info-strip.const';
import { InfoStripIconSize, InfoStripIconType } from './info-strip.enum';

@Component({
  selector: 'b-info-strip',
  templateUrl: './info-strip.component.html',
  styleUrls: ['./info-strip.component.scss'],
})
export class InfoStripComponent {
  @HostBinding('attr.data-type') @Input() iconType: InfoStripIconType = InfoStripIconType.information;
  @Input() link: Link;
  @Input() text: string;
  @Input() iconSize: InfoStripIconSize = InfoStripIconSize.large;
  @Output() linkClicked: EventEmitter<void> = new EventEmitter<void>();
  readonly iconSizes = InfoStripIconSize;
  readonly iconsDic: Record<InfoStripIconType, Icon> = INFOSTRIP_ICON_DICT;

  constructor() {}
}

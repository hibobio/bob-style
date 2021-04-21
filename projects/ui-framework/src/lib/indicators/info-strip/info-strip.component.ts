import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

import { Icon } from '../../icons/icon.interface';
import { Link } from '../link/link.types';
import { INFOSTRIP_ICON_DICT } from './info-strip.const';
import { InfoStripIconSize, InfoStripIconType } from './info-strip.enum';

@Component({
  selector: 'b-info-strip',
  templateUrl: './info-strip.component.html',
  styleUrls: ['./info-strip.component.scss'],
})
export class InfoStripComponent implements OnInit {
  @Input() iconType: InfoStripIconType = InfoStripIconType.information;
  @Input() link: Link;
  @Input() text: string;
  @Input() iconSize: InfoStripIconSize = InfoStripIconSize.large;
  @Output() linkClicked: EventEmitter<void> = new EventEmitter<void>();
  @HostBinding('class.warning') warning: boolean;
  @HostBinding('class.information') information: boolean;
  @HostBinding('class.error') error: boolean;
  @HostBinding('class.success') success: boolean;
  readonly iconSizes = InfoStripIconSize;
  readonly iconsDic: Record<InfoStripIconType, Icon> = INFOSTRIP_ICON_DICT;

  constructor() {}

  ngOnInit(): void {
    this.warning = this.iconType === InfoStripIconType.warning;
    this.information = this.iconType === InfoStripIconType.information;
    this.error = this.iconType === InfoStripIconType.error;
    this.success = this.iconType === InfoStripIconType.success;
  }
}

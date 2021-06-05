import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ICON_CONFIG } from '../../icons/common-icons.const';
import { Icon } from '../../icons/icon.interface';
import { Icons } from '../../icons/icons.enum';
import { Link } from '../../indicators/link/link.types';
import {
  isFunction,
  isObject,
  isString,
  objectMapKeys,
  objectRemoveEntriesByValue,
} from '../../services/utils/functional-utils';
import { InfoTooltip } from './info-tooltip.interface';

@Component({
  selector: 'b-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss'],
})
export class InfoTooltipComponent {
  @Input() title: string;
  @Input() text: string;
  @Input() link: Link;

  @Input() useContentTemplate: boolean;

  public iconConfig: Icon = ICON_CONFIG.info;

  @Input() set icon(icon: Icons | Icon) {
    if (isString(icon)) {
      this.iconConfig = { ...this.iconConfig, icon };
    }
    if (isObject(icon)) {
      this.iconConfig = { ...this.iconConfig, ...icon };
    }
  }
  get icon() {
    return this.iconConfig.icon;
  }
  @Input() set iconSize(size: Icon['size']) {
    if (size) {
      this.iconConfig = { ...this.iconConfig, size };
    }
  }
  get iconSize() {
    return this.iconConfig.size;
  }

  @Input('config') set setProps(config: InfoTooltip) {
    if (isObject(config)) {
      Object.assign(
        this,
        objectMapKeys(objectRemoveEntriesByValue(config, [undefined]), {
          linkClicked: 'linkClickHandler',
        })
      );
    }
  }

  @Output() linkClicked: EventEmitter<void> = new EventEmitter<void>();
  linkClickHandler: () => void;

  onLinkClick() {
    this.linkClicked.emit();
    if (isFunction(this.linkClickHandler)) {
      this.linkClickHandler();
    }
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { Link } from '../../indicators/link/link.types';
import {
  applyChanges,
  isFunction,
  isObject,
  objectMapKeys,
  objectRemoveEntriesByValue,
} from '../../services/utils/functional-utils';
import { InfoTooltip } from './info-tooltip.interface';

@Component({
  selector: 'b-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss'],
})
export class InfoTooltipComponent implements OnChanges {
  @Input() title: string;
  @Input() text: string;
  @Input() link: Link;
  @Input() icon: Icons = Icons.info_outline;
  @Input() iconSize: IconSize = IconSize.large;
  @Output() linkClicked: EventEmitter<void> = new EventEmitter<void>();
  linkClickHandler: () => void;

  readonly iconColor: IconColor = IconColor.dark;

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

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);
  }

  onLinkClick() {
    this.linkClicked.emit();
    if (isFunction(this.linkClickHandler)) {
      this.linkClickHandler();
    }
  }
}

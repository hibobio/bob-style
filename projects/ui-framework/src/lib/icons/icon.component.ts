import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { TooltipClass } from '../popups/tooltip/tooltip.enum';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import {
  applyChanges,
  hasChanges,
  isObject,
  notFirstChanges,
  objectRemoveEntriesByValue,
} from '../services/utils/functional-utils';
import { Icon, IconInputCmnt } from './icon.interface';
import { getIconColor, getIconSize } from './icon.static';
import { IconColor, IconRotate, Icons, IconSize, IconType } from './icons.enum';

@Component({
  selector: 'b-icon, [b-icon]',
  template: `
    <span
      class="b-icon"
      [ngClass]="icon"
      [class.has-hover]="hasHoverState || null"
      [attr.data-icon-before-size]="size || null"
      [attr.data-icon-before-color]="color || null"
      [attr.data-icon-before-rotate]="rotate || null"
      aria-hidden="true"
    ></span>
  `,
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnChanges {
  constructor(
    private host: ElementRef,
    private DOM: DOMhelpers,
    private cd: ChangeDetectorRef
  ) {}

  @Input('config') set setProps(config: Icon) {
    if (isObject(config)) {
      Object.assign(this, objectRemoveEntriesByValue(config, [undefined]));
    }
  }

  @Input() icon: IconInputCmnt | Icons;
  @Input() color: IconInputCmnt | Icon['color'] = IconColor.dark;
  @HostBinding('attr.data-size') @Input() size: IconInputCmnt | Icon['size'] =
    IconSize.medium;

  @Input() rotate: IconInputCmnt | IconRotate = null;
  @Input() hasHoverState: IconInputCmnt | boolean = false;
  @Input() tooltipClass: IconInputCmnt | TooltipClass | TooltipClass[];

  @HostBinding('attr.data-type') @Input() type: IconInputCmnt | IconType =
    IconType.regular;

  @HostBinding('attr.data-tooltip') @Input() toolTipSummary:
    | IconInputCmnt
    | string = null;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        size: IconSize.medium,
        type: IconType.regular,
        color: IconColor.dark,
      },
      [],
      true
    );

    if (hasChanges(changes, ['color', 'setProps'], true)) {
      const { color, cssVar } = getIconColor(this.color);
      this.color = color;
      this.DOM.setCssProps(this.host.nativeElement, {
        '--icon-before-color': cssVar,
      });
    }

    if (hasChanges(changes, ['size', 'setProps'], true)) {
      const { size, cssVar } = getIconSize(this.size);
      this.size = size;
      this.DOM.setCssProps(this.host.nativeElement, {
        '--icon-before-size': cssVar,
      });
    }

    if (changes.tooltipClass) {
      this.DOM.bindClasses(this.host.nativeElement, this.tooltipClass);
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}

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
import { Color } from '../types';
import { Icon } from './icon.interface';
import { IconColor, IconRotate, Icons, IconSize, IconType } from './icons.enum';

@Component({
  selector: 'b-icon, [b-icon]',
  template: `
    <span
      class="b-icon"
      [ngClass]="icon"
      [class.has-hover]="hasHoverState || null"
      [attr.data-icon-before-size]="customSize ? 'custom' : size || null"
      [attr.data-icon-before-color]="customColor ? 'custom' : color || null"
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

  @Input() icon: Icons;
  @Input() color: IconColor | Color = IconColor.dark;
  @HostBinding('attr.data-size') @Input() size: IconSize | string | number =
    IconSize.medium;
  @Input() rotate: IconRotate = null;
  @HostBinding('attr.data-type') @Input() type: IconType = IconType.regular;
  @Input() hasHoverState = false;
  @Input() tooltipClass: TooltipClass | TooltipClass[];
  @HostBinding('attr.data-tooltip') @Input() toolTipSummary: string = null;

  public customColor = false;
  public customSize = false;

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
      this.customColor = !Object.values(IconColor).includes(this.color as any);
      this.DOM.setCssProps(this.host.nativeElement, {
        '--icon-before-color': this.customColor ? this.color : null,
      });
    }

    if (hasChanges(changes, ['size', 'setProps'], true)) {
      this.customSize = !Object.values(IconSize).includes(this.size as any);
      this.DOM.setCssProps(this.host.nativeElement, {
        '--icon-before-size': this.customSize
          ? parseInt(this.size as any, 10) + 'px'
          : null,
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

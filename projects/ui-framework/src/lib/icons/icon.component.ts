import {
  Component,
  Input,
  HostBinding,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { IconColor, Icons, IconSize, IconType, IconRotate } from './icons.enum';
import {
  notFirstChanges,
  applyChanges,
  isObject,
  objectRemoveEntriesByValue,
} from '../services/utils/functional-utils';
import { TooltipClass } from '../popups/tooltip/tooltip.enum';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import { Icon } from './icon.interface';

@Component({
  selector: 'b-icon, [b-icon]',
  template: `
    <span class="b-icon" [ngClass]="iconClass" aria-hidden="true"></span>
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

  @HostBinding('attr.data-size') @Input() size: IconSize = IconSize.medium;
  @HostBinding('attr.data-type') @Input() type: IconType = IconType.regular;
  @HostBinding('attr.data-tooltip') @Input() toolTipSummary: string = null;
  @HostBinding('attr.data-rotate') @Input() rotate: IconRotate = null;

  @Input('config') set setProps(config: Icon) {
    if (isObject(config)) {
      Object.assign(this, objectRemoveEntriesByValue(config, [undefined]));
    }
  }

  @Input() icon: Icons;
  @Input() color: IconColor = IconColor.dark;
  @Input() hasHoverState = false;
  @Input() tooltipClass: TooltipClass | TooltipClass[];

  public iconClass: string = null;

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

    this.iconClass =
      this.icon +
      ' b-icon-' +
      this.size +
      ' b-icon-' +
      this.color +
      (this.hasHoverState ? ' has-hover' : '');

    if (changes.tooltipClass) {
      this.DOM.bindClasses(this.host.nativeElement, this.tooltipClass);
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}

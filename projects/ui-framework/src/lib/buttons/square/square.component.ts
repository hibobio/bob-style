import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { Icon } from '../../icons/icon.interface';
import { getIconColor } from '../../icons/icon.static';
import { IconSize } from '../../icons/icons.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  hasChanges,
  notFirstChanges,
} from '../../services/utils/functional-utils';
import { BaseButtonElement } from '../button.abstract';
import { ButtonSize, ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-square-button, [b-square-button]',
  template: `
    <button
      #button
      type="button"
      [attr.id]="id || null"
      [ngClass]="buttonClass"
      [class.has-hover]="type === buttonType.tertiary"
      [attr.disabled]="disabled || null"
      [attr.data-icon-before]="icn || null"
      [attr.data-icon-before-size]="icn ? icnSize : null"
      [attr.data-icon-before-color]="icn ? color || 'inherit' : null"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./square.component.scss'],
  providers: [
    { provide: BaseButtonElement, useExisting: SquareButtonComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquareButtonComponent
  extends BaseButtonElement
  implements OnChanges {
  constructor(
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected host: ElementRef<HTMLElement>,
    protected DOM: DOMhelpers
  ) {
    super(cd, zone);

    this.typeDefault = ButtonType.secondary;
  }

  @Input() color: Icon['color'];
  @Input() toolTipSummary: string = null;
  public customColor = false;

  @HostBinding('attr.data-tooltip') get getTooltipText(): string {
    return (!this.disabled && (this.toolTipSummary || this.text)) || null;
  }

  @HostBinding('attr.data-round') @Input() round = false;

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes, false);

    this.icnSize =
      this.size === ButtonSize.small ? IconSize.medium : IconSize.large;

    if (hasChanges(changes, ['color', 'setProps'], true)) {
      const { color, cssVar } = getIconColor(this.color);
      this.color = color;
      this.DOM.setCssProps(this.host.nativeElement, {
        '--icon-before-color': cssVar,
      });
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { IconColor, IconSize } from '../../icons/icons.enum';
import { notFirstChanges } from '../../services/utils/functional-utils';
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
  constructor(protected cd: ChangeDetectorRef, protected zone: NgZone) {
    super(cd, zone);

    this.typeDefault = ButtonType.secondary;
  }

  @Input() color: IconColor;
  @Input() toolTipSummary: string = null;

  @HostBinding('attr.data-tooltip') get getTooltipText(): string {
    return (!this.disabled && (this.toolTipSummary || this.text)) || null;
  }

  @HostBinding('attr.data-round') @Input() round = false;

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes, false);

    this.icnSize =
      this.size === ButtonSize.small ? IconSize.medium : IconSize.large;

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}

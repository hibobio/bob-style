import { Component, Input, HostBinding } from '@angular/core';
import { ButtonSize } from '../buttons.enum';
import { IconColor, IconSize } from '../../../icons/icons.enum';
import { BaseButtonElement } from '../button.abstract';

@Component({
  selector: 'b-square-button',
  template: `
    <button
      type="button"
      class="{{ type || buttonType.primary }} {{ size || buttonSize.medium }} {{
        getIconClass()
      }}"
      [attr.disabled]="disabled || null"
      (click)="onClick($event)"
    ></button>
  `,
  styleUrls: ['./square.component.scss']
})
export class SquareButtonComponent extends BaseButtonElement {
  constructor() {
    super();
  }

  @Input() color: IconColor = IconColor.dark;

  @HostBinding('attr.data-tooltip') @Input() toolTipSummary: string = null;

  getIconClass(): string {
    return this.icon
      ? this.icon +
          ' b-icon-' +
          (this.size === ButtonSize.small ? IconSize.medium : IconSize.large) +
          ' b-icon-' +
          this.color
      : '';
  }
}

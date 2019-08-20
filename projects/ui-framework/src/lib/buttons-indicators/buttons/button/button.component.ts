import { Component } from '@angular/core';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { IconColor, IconSize } from '../../../icons/icons.enum';
import { BaseButtonElement } from '../button.abstract';

@Component({
  selector: 'b-button',
  template: `
    <button
      #button
      type="button"
      class="{{ type || buttonType.primary }} {{ size || buttonSize.medium }} {{
        getIconClass()
      }}"
      [attr.disabled]="disabled || null"
      (click)="onClick($event)"
    >
      {{ text }}
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent extends BaseButtonElement {
  constructor() {
    super();
  }

  getIconClass(): string {
    return this.icon
      ? this.icon +
          ' b-icon-' +
          (this.size === ButtonSize.large ? IconSize.large : IconSize.medium) +
          ' b-icon-' +
          (this.type === ButtonType.primary ? IconColor.white : IconColor.dark)
      : '';
  }
}

import { Component } from '@angular/core';
import { BaseButtonElement } from '../button.abstract';
import { Icons, IconColor, IconSize } from '../../../icons/icons.enum';

@Component({
  selector: 'b-back-button',
  template: `
    <button
      #button
      type="button"
      class="{{ type || buttonType.secondary }} {{ buttonSize.small }} {{
        getIconClass()
      }}"
      [attr.disabled]="disabled || null"
      (click)="onClick($event)"
    >
      {{ text }}
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['../button/button.component.scss']
})
export class BackButtonComponent extends BaseButtonElement {
  constructor() {
    super();
  }

  getIconClass(): string {
    return (
      Icons.back_arrow_link +
      ' b-icon-' +
      IconSize.medium +
      ' b-icon-' +
      IconColor.dark
    );
  }
}

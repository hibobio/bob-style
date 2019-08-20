import { Component, Input } from '@angular/core';
import { BaseButtonElement } from '../button.abstract';
import { Icons, IconSize, IconColor } from '../../../icons/icons.enum';

@Component({
  selector: 'b-chevron-button',
  template: `
    <button
      #button
      type="button"
      class="icon-after {{ buttonType.secondary }} {{ buttonSize.medium }} {{
        getIconClass()
      }}"
      (click)="onClick($event)"
      [attr.disabled]="disabled || null"
    >
      {{ text }}
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['../button/button.component.scss']
})
export class ChevronButtonComponent extends BaseButtonElement {
  constructor() {
    super();
  }

  @Input() active = false;

  getIconClass(): string {
    return (
      (this.active ? Icons.chevron_up : Icons.chevron_down) +
      ' b-icon-' +
      IconSize.medium +
      ' b-icon-' +
      IconColor.dark
    );
  }
}

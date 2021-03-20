import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';

import { BaseButtonElement } from '../button.abstract';

@Component({
  selector: 'b-button, [b-button]',
  template: `
    <button
      #button
      type="button"
      [ngClass]="buttonClass"
      [attr.disabled]="disabled || null"
      [attr.data-icon-before]="icn || null"
      [attr.data-icon-before-size]="icn ? icnSize : null"
      [attr.data-icon-before-color]="icn ? icnColor : null"
    >
      {{ text }}
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss'],
  providers: [{ provide: BaseButtonElement, useExisting: ButtonComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent extends BaseButtonElement {
  constructor(protected cd: ChangeDetectorRef, protected zone: NgZone) {
    super(cd, zone);
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';

import { Icons } from '../../icons/icons.enum';
import { BaseButtonElement } from '../button.abstract';
import { ButtonSize, ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-back-button, [b-back-button]',
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
  styleUrls: ['../button/button.component.scss', './back-button.component.scss'],
  providers: [{ provide: BaseButtonElement, useExisting: BackButtonComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent extends BaseButtonElement {
  constructor(protected cd: ChangeDetectorRef, protected zone: NgZone) {
    super(cd, zone);

    this.typeDefault = ButtonType.secondary;
    this.icon = Icons.back_arrow_link;
    this.size = ButtonSize.small;
  }
}

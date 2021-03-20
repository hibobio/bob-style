import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone } from '@angular/core';

import { IconColor } from '../../icons/icons.enum';
import { LinkColor } from '../../indicators/link/link.enum';
import { BaseButtonElement } from '../button.abstract';
import { ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-text-button, [b-text-button]',
  template: `
    <span
      #button
      role="button"
      class="text-button"
      [ngClass]="buttonClass"
      [attr.data-icon-before]="icn || null"
      [attr.data-icon-before-size]="icn ? iconSize.medium : null"
    >
      {{ text }}
      <ng-content></ng-content>
    </span>
  `,
  styleUrls: ['./text-button.component.scss'],
  providers: [{ provide: BaseButtonElement, useExisting: TextButtonComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextButtonComponent extends BaseButtonElement {
  constructor(protected cd: ChangeDetectorRef, protected zone: NgZone) {
    super(cd, zone);

    this.typeDefault = ButtonType.secondary;
  }

  @Input() type: ButtonType = ButtonType.secondary;
  @Input() color: LinkColor = LinkColor.none;

  private readonly iconColorMap = {
    [ButtonType.primary]: 'b-icon-' + IconColor.primary,
    [ButtonType.secondary]: 'b-icon-' + IconColor.dark,
    [ButtonType.tertiary]: 'b-icon-' + IconColor.normal,
    [ButtonType.negative]: 'b-icon-' + IconColor.negative,
  };

  protected getButtonClass(): string {
    return (
      (this.color === LinkColor.primary ? 'color-primary ' : '') +
      (this.disabled ? 'disabled ' : '') +
      (this.icon
        ? ' ' + (this.color === LinkColor.primary ? 'b-icon-' + IconColor.primary : this.iconColorMap[this.type])
        : '')
    );
  }
}

import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { LinkColor } from '../../indicators/link/link.enum';
import { BaseButtonElement } from '../button.abstract';
import { ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-text-button',
  template: `
    <span
      role="button"
      class="text-button"
      [ngClass]="buttonClass"
      [attr.data-icon-before]="icn || null"
      [attr.data-icon-before-size]="icn ? iconSize.medium : null"
      (click)="onClick($event)"
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
  constructor(protected cd: ChangeDetectorRef) {
    super(cd);
  }

  @Input() type: ButtonType = ButtonType.secondary;
  @Input() color: LinkColor = LinkColor.none;

  private readonly iconColorMap = {
    [ButtonType.primary]: 'b-icon-' + IconColor.primary,
    [ButtonType.secondary]: 'b-icon-' + IconColor.dark,
    [ButtonType.tertiary]: 'b-icon-' + IconColor.normal,
    [ButtonType.negative]: 'b-icon-' + IconColor.negative,
  };

  getButtonClass(): string {
    return (
      (this.color === LinkColor.primary ? 'color-primary ' : '') +
      (this.disabled ? 'disabled ' : '') +
      (this.icon
        ? ' ' +
          (this.color === LinkColor.primary
            ? 'b-icon-' + IconColor.primary
            : this.iconColorMap[this.type])
        : '')
    );
  }
}

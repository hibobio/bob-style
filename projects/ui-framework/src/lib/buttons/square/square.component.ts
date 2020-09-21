import {
  Component,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { BaseButtonElement } from '../button.abstract';

@Component({
  selector: 'b-square-button',
  template: `
    <button
      type="button"
      [ngClass]="buttonClass"
      [attr.disabled]="disabled || null"
      [attr.data-icon-before]="icn || null"
      [attr.data-icon-before-color]="icn ? color || icnColor : null"
      (click)="onClick($event)"
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
export class SquareButtonComponent extends BaseButtonElement {
  constructor(protected cd: ChangeDetectorRef) {
    super(cd);
  }

  @Input() color: IconColor;
  @Input() toolTipSummary: string = null;

  @HostBinding('attr.data-tooltip') get getTooltipText(): string {
    return (!this.disabled && (this.toolTipSummary || this.text)) || null;
  }

  @HostBinding('attr.data-round') @Input() round = false;

  getButtonClass(): string {
    return (
      (this.type || ButtonType.secondary) +
      ' ' +
      (this.size || ButtonSize.medium) +
      ' ' +
      (this.icon
        ? 'b-icon-' +
          (this.size === ButtonSize.small ? IconSize.medium : IconSize.large) +
          (this.type === ButtonType.tertiary ? ' has-hover' : '')
        : '')
    );
  }
}

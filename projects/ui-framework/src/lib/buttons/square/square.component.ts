import {
  Component,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { IconSize, IconColor } from '../../icons/icons.enum';
import { BaseButtonElement } from '../button.abstract';

@Component({
  selector: 'b-square-button',
  template: `
    <button
      type="button"
      [ngClass]="buttonClass"
      [attr.disabled]="disabled || null"
      (click)="onClick($event)"
    ></button>
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

  @Input() color: IconColor = IconColor.dark;
  @Input() toolTipSummary: string = null;

  @HostBinding('attr.data-tooltip') get getTooltipText(): string {
    return (!this.disabled && (this.toolTipSummary || this.text)) || null;
  }

  getButtonClass(): string {
    return (
      (this.type || ButtonType.secondary) +
      ' ' +
      (this.size || ButtonSize.medium) +
      ' ' +
      (this.icon
        ? this.icon +
          ' b-icon-' +
          (this.size === ButtonSize.small ? IconSize.medium : IconSize.large) +
          ' b-icon-' +
          (this.color || IconColor.dark) +
          (this.type === ButtonType.tertiary ? ' has-hover' : '')
        : '')
    );
  }
}

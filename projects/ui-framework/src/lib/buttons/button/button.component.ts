import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { BaseButtonElement } from '../button.abstract';

@Component({
  selector: 'b-button',
  template: `
    <button
      #button
      type="button"
      [ngClass]="buttonClass"
      [attr.disabled]="disabled || null"
      (click)="onClick($event)"
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
  constructor(protected cd: ChangeDetectorRef) {
    super(cd);
  }

  getButtonClass(): string {
    return (
      (this.type || ButtonType.primary) +
      ' ' +
      (this.size || ButtonSize.medium) +
      ' ' +
      (this.icon
        ? this.icon +
          ' b-icon-' +
          (this.size === ButtonSize.large ? IconSize.large : IconSize.medium) +
          ' b-icon-' +
          (!this.type ||
          this.type === ButtonType.primary ||
          this.type === ButtonType.negative
            ? IconColor.white
            : IconColor.dark)
        : '')
    );
  }
}

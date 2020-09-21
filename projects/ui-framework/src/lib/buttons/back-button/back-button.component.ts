import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseButtonElement } from '../button.abstract';
import { Icons, IconColor, IconSize } from '../../icons/icons.enum';
import { ButtonSize, ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-back-button',
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
  styleUrls: [
    '../button/button.component.scss',
    './back-button.component.scss',
  ],
  providers: [{ provide: BaseButtonElement, useExisting: BackButtonComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent extends BaseButtonElement {
  constructor(protected cd: ChangeDetectorRef) {
    super(cd);
  }

  getButtonClass(): string {
    return (
      (this.type || ButtonType.secondary) +
      ' ' +
      ButtonSize.small +
      ' ' +
      (Icons.back_arrow_link +
        ' b-icon-' +
        IconSize.medium +
        ' b-icon-' +
        IconColor.dark)
    );
  }
}

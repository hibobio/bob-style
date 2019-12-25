import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { BaseButtonElement } from '../button.abstract';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { ButtonSize, ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-chevron-button',
  template: `
    <button
      #button
      type="button"
      [ngClass]="buttonClass"
      (click)="onClick($event)"
      [attr.disabled]="disabled || null"
    >
      {{ text }}
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['../button/button.component.scss'],
  providers: [
    { provide: BaseButtonElement, useExisting: ChevronButtonComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChevronButtonComponent extends BaseButtonElement {
  constructor(protected cd: ChangeDetectorRef) {
    super(cd);
  }

  getButtonClass(): string {
    return (
      (this.type || ButtonType.secondary) +
      ' ' +
      (this.size || ButtonSize.medium) +
      ' ' +
      ((this.active ? Icons.chevron_up : Icons.chevron_down) +
        ' b-icon-' +
        ' b-icon-' +
        (this.size === ButtonSize.large ? IconSize.large : IconSize.medium) +
        ' b-icon-' +
        (this.type === ButtonType.primary ? IconColor.white : IconColor.dark)) +
      ' icon-after'
    );
  }
}

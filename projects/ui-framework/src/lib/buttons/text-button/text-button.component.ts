import {
  Component,
  HostListener,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { LinkColor } from '../../indicators/link/link.enum';
import { BaseButtonElement } from '../button.abstract';

@Component({
  selector: 'b-text-button',
  template: `
    <span
      role="button"
      class="text-button"
      [ngClass]="buttonClass"
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

  @Input() color: LinkColor = LinkColor.none;

  getButtonClass(): string {
    return (
      (this.color === LinkColor.primary ? 'color-primary ' : '') +
      (this.disabled ? 'disabled ' : '') +
      (this.icon
        ? this.icon +
          ' b-icon-' +
          IconSize.medium +
          ' b-icon-' +
          (this.color === LinkColor.none ? IconColor.dark : IconColor.primary)
        : '')
    );
  }
}

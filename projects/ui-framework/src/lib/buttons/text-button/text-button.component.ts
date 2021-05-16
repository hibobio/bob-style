import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { IconSize } from '../../icons/icons.enum';
import { LinkColor } from '../../indicators/link/link.enum';
import { notFirstChanges } from '../../services/utils/functional-utils';
import { BaseButtonElement } from '../button.abstract';
import { ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-text-button, [b-text-button]',
  template: `
    <span
      #button
      role="button"
      [attr.id]="id || null"
      class="text-button"
      [ngClass]="buttonClass"
      [attr.data-icon-before]="icn || null"
      [attr.data-icon-before-size]="icn ? iconSize.medium : null"
      [attr.data-icon-before-color]="icn ? 'inherit' : null"
    >
      {{ text }}
      <ng-content></ng-content>
    </span>
  `,
  styleUrls: ['./text-button.component.scss'],
  providers: [{ provide: BaseButtonElement, useExisting: TextButtonComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextButtonComponent
  extends BaseButtonElement
  implements OnChanges {
  constructor(protected cd: ChangeDetectorRef, protected zone: NgZone) {
    super(cd, zone);

    this.typeDefault = ButtonType.secondary;
  }

  @Input() type: ButtonType = ButtonType.secondary;
  @Input() color: 'deprecated property' | LinkColor;

  readonly iconSize = IconSize;

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes, false);

    if (
      changes.color &&
      !changes.type &&
      this.color === LinkColor.primary &&
      this.type !== ButtonType.primary
    ) {
      this.type = ButtonType.primary;
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  protected getButtonClass(): string {
    return (this.id ? this.id + ' ' : '') + (this.disabled ? 'disabled ' : '');
  }
}

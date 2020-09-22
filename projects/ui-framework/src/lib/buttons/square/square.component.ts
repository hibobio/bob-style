import {
  Component,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { BaseButtonElement } from '../button.abstract';
import { notFirstChanges } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-square-button',
  template: `
    <button
      type="button"
      [ngClass]="buttonClass"
      [class.has-hover]="type === buttonType.tertiary"
      [attr.disabled]="disabled || null"
      [attr.data-icon-before]="icn || null"
      [attr.data-icon-before-size]="icn ? icnSize : null"
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
export class SquareButtonComponent extends BaseButtonElement
  implements OnChanges {
  constructor(protected cd: ChangeDetectorRef) {
    super(cd);

    this.typeDefault = ButtonType.secondary;
  }

  @Input() color: IconColor;
  @Input() toolTipSummary: string = null;

  @HostBinding('attr.data-tooltip') get getTooltipText(): string {
    return (!this.disabled && (this.toolTipSummary || this.text)) || null;
  }

  @HostBinding('attr.data-round') @Input() round = false;

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes, false);

    this.icnSize =
      this.size === ButtonSize.small ? IconSize.medium : IconSize.large;

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}

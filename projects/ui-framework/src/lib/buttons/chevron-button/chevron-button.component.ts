import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { Icons } from '../../icons/icons.enum';
import { BaseButtonElement } from '../button.abstract';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-chevron-button',
  template: `
    <button
      #button
      type="button"
      [ngClass]="buttonClass"
      [attr.disabled]="disabled || null"
      [attr.data-icon-before]="icn || null"
      [attr.data-icon-before-size]="icn ? icnSize : null"
      [attr.data-icon-before-color]="icn ? icnColor : null"
      [attr.data-icon-after]="!active ? chevronIcn[0] : chevronIcn[1]"
      [attr.data-icon-after-size]="icnSize"
      [attr.data-icon-after-color]="icnColor"
      (click)="onClick($event)"
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
export class ChevronButtonComponent extends ButtonComponent implements OnInit {
  constructor(protected cd: ChangeDetectorRef) {
    super(cd);

    this.typeDefault = ButtonType.secondary;
  }

  public chevronIcn = [
    Icons.chevron_down.replace('b-icon-', ''),
    Icons.chevron_up.replace('b-icon-', ''),
  ];
}

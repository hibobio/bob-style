import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
} from '@angular/core';

import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { BaseButtonElement } from '../button.abstract';
import { SquareButtonComponent } from '../square/square.component';

@Component({
  selector: 'b-round-button, [b-round-button]',
  template: `
    <button
      #button
      type="button"
      [ngClass]="buttonClass"
      [attr.disabled]="disabled || null"
      [attr.data-icon-before]="icn || null"
      [attr.data-icon-before-size]="icn ? icnSize : null"
      [attr.data-icon-before-color]="icn ? color || 'inherit' : null"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['../square/square.component.scss'],
  providers: [
    { provide: BaseButtonElement, useExisting: RoundButtonComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundButtonComponent extends SquareButtonComponent {
  constructor(
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected host: ElementRef<HTMLElement>,
    protected DOM: DOMhelpers
  ) {
    super(cd, zone, host, DOM);
    this.round = true;
  }
}

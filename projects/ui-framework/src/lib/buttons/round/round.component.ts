import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { BaseButtonElement } from '../button.abstract';
import { SquareButtonComponent } from '../square/square.component';

@Component({
  selector: 'b-round-button',
  template: `
    <button
      type="button"
      [ngClass]="buttonClass"
      [attr.disabled]="disabled || null"
      [attr.data-icon-before]="icn || null"
      [attr.data-icon-before-size]="icn ? icnSize : null"
      [attr.data-icon-before-color]="icn ? icnColor : null"
      (click)="onClick($event)"
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
  constructor(protected cd: ChangeDetectorRef) {
    super(cd);
    this.round = true;
  }
}

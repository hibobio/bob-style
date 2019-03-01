import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonType, ButtonSize } from '../buttons.enum';

@Component({
  selector: 'b-button',
  template: `
    <button mat-button
            class="{{type}} {{size}}"
            [disableRipple]="true"
            [ngClass]="{'disabled': disabled}"
            (click)="onClick($event)">
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() type?: ButtonType = ButtonType.primary;
  @Input() size?: ButtonSize = ButtonSize.medium;
  @Input() disabled = false;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  onClick($event) {
    this.clicked.emit($event);
  }
}

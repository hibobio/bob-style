import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonType, ButtonSize } from '../buttons.enum';

@Component({
  selector: 'b-button',
  template: `
    <button mat-button
            [disableRipple]="true"
            [ngClass]="getClassNames()"
            (click)="onClick($event)">
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  constructor() { }
  @Input() type?: ButtonType = ButtonType.primary;
  @Input() size?: ButtonSize = ButtonSize.medium;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  getClassNames() {
    return `${this.type} ${this.size}`;
  }

  onClick($event) {
    this.clicked.emit($event);
  }

}

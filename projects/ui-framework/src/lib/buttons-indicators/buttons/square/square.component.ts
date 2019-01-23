import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-square-button',
  template: `
    <button mat-button [disableRipple]="true"
      [ngClass]="type"
      (click)="onClick($event)">
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./square.component.scss']
})
export class SquareButtonComponent {

  constructor() { }
  @Input() type?: ButtonType = ButtonType.primary;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick($event) {
    this.clicked.emit($event);
  }

}

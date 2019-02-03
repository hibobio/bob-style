import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonType } from '../buttons.enum';
import { IconColor, Icons, IconSize } from '../../../icons';

@Component({
  selector: 'b-square-button',
  template: `
    <button mat-button [disableRipple]="true"
            [ngClass]="type"
            (click)="onClick($event)">
      <b-icon [icon]="icon"
              [size]="iconSize.medium"
              [color]="color">
      </b-icon>
    </button>
  `,
  styleUrls: ['./square.component.scss']
})
export class SquareButtonComponent {

  @Input() type?: ButtonType = ButtonType.primary;
  @Input() icon: Icons;
  @Input() color: IconColor = IconColor.dark;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  iconSize = IconSize;

  constructor() {
  }

  onClick($event) {
    this.clicked.emit($event);
  }
}

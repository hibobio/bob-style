import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BackButtonType, ButtonSize } from '../buttons.enum';
import { Icons } from '../../../icons/icons.enum';

@Component({
  selector: 'b-back-button',
  template: `
    <b-button
      (clicked)="onClick($event)"
      [text]="text"
      [type]="type"
      [size]="size"
      [icon]="icons.back_arrow_link"
      [disabled]="disabled"
    >
      <ng-content></ng-content>
    </b-button>
  `,
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {
  @Input() text: string;
  @Input() type?: BackButtonType = BackButtonType.secondary;
  @Input() disabled = false;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  size: ButtonSize = ButtonSize.small;
  icons = Icons;

  constructor() {}

  onClick($event) {
    this.clicked.emit($event);
  }
}

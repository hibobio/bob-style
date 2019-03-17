import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ButtonSize, BackButtonType } from '../buttons.enum';
import { Icons, IconSize } from '../../../icons/icons.enum';

@Component({
  selector: 'b-back-button',
  template: `
    <b-button (clicked)="onClick($event)"
            [type]="type"
            [size]="size"
            [disabled]="disabled">
      <b-icon icon="${Icons.back_arrow_link}"
            size="${IconSize.small}">
      </b-icon>
      <ng-content></ng-content>
    </b-button>
  `,
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {

  constructor() { }

  size: ButtonSize = ButtonSize.small;
  @Input() type?: BackButtonType = BackButtonType.secondary;
  @Input() disabled = false;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick($event) {
    this.clicked.emit($event);
  }
}

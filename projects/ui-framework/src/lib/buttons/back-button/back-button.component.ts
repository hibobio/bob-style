import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ButtonSize, BackButtonType } from '../buttons.enum';
import { Icons, IconSize } from '../../icons/icons.enum';

@Component({
  selector: 'b-back-button',
  template: `
    <b-button
      (clicked)="onClick($event)"
      [type]="type"
      [size]="size">
      <span class="back-button-content-wrapper">
        <b-icon icon="${Icons.back_arrow_link}" size="${IconSize.mini}"></b-icon>
        <span class="back-button-content">
          <ng-content></ng-content>
        </span>
      </span>
    </b-button>
  `,
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {

  constructor() { }
  size: ButtonSize = ButtonSize.small;
  @Input() type?: BackButtonType = BackButtonType.secondary;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick($event) {
    this.clicked.emit($event);
  }

}

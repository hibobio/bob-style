import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ButtonSize, BackButtonType } from '../buttons.enum';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';

@Component({
  selector: 'b-back-button',
  template: `
    <b-button (clicked)="onClick($event)"
<<<<<<< HEAD
              [type]="type"
              [size]="size"
              [disabled]="disabled">
      <span class="back-button-content-wrapper">
        <b-icon icon="${Icons.back_arrow_link}"
                size="${IconSize.small}">
        </b-icon>
        <span class="back-button-content">
          <ng-content></ng-content>
        </span>
      </span>
=======
            [type]="type"
            [size]="size"
            [disabled]="disabled">
      <b-icon icon="${Icons.back_arrow_link}"
            size="${IconSize.small}"
            [color]="disabled ? iconColor.light : color">
      </b-icon>
      <ng-content></ng-content>
>>>>>>> origin/master
    </b-button>
  `,
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {

  constructor() { }

  size: ButtonSize = ButtonSize.small;
  @Input() type?: BackButtonType = BackButtonType.secondary;
  @Input() disabled = false;
<<<<<<< HEAD
=======
  @Input() color: IconColor = IconColor.dark;
>>>>>>> origin/master
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  iconColor = IconColor;

  onClick($event) {
    this.clicked.emit($event);
  }
}

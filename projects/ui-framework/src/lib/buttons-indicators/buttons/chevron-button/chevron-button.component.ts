import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';
import { ButtonSize, ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-chevron-button',
  template: `
    <button type="button"
            class="icon-after {{ buttonType.secondary }} {{ buttonSize.medium }}
                   {{ (active ? icons.chevron_up : icons.chevron_down) +
                   ' b-icon-' + iconSize.medium + ' b-icon-' + iconColor.dark}}"
            (click)="onClick($event)">
      {{ text }}
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['../button/button.component.scss'],
})
export class ChevronButtonComponent {
  @Input() text: string;
  @Input() active = false;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  buttonType = ButtonType;
  buttonSize = ButtonSize;
  icons = Icons;
  iconSize = IconSize;
  iconColor = IconColor;

  onClick($event) {
    this.clicked.emit($event);
  }
}

import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';
import { ButtonSize, ButtonType } from '../buttons.enum';

@Component({
  selector: 'b-chevron-button',
  template: `
    <button
      #button
      type="button"
      class="icon-after {{ buttonType.secondary }} {{ buttonSize.medium }}
                   {{
        (active ? icons.chevron_up : icons.chevron_down) +
          ' b-icon-' +
          iconSize.medium +
          ' b-icon-' +
          iconColor.dark
      }}"
      (click)="onClick($event)"
      [attr.disabled]="disabled || null"
    >
      {{ text }}
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['../button/button.component.scss']
})
export class ChevronButtonComponent {
  @ViewChild('button', { static: true }) public button: ElementRef;
  @Input() text: string;
  @Input() active = false;
  @Input() disabled = false;
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

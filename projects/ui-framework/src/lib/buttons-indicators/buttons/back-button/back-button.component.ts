import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { BackButtonType, ButtonSize } from '../buttons.enum';
import { Icons, IconSize, IconColor } from '../../../icons/icons.enum';

@Component({
  selector: 'b-back-button',
  template: `
    <button
      #button
      type="button"
      class="{{ type }} {{ buttonSize.small }} {{
        icons.back_arrow_link +
          ' b-icon-' +
          iconSize.medium +
          ' b-icon-' +
          iconColor.dark
      }}"
      [attr.disabled]="disabled || null"
      (click)="onClick($event)"
    >
      {{ text }}
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['../button/button.component.scss']
})
export class BackButtonComponent {
  @ViewChild('button', { static: true }) public button: ElementRef;
  @Input() text: string;
  @Input() type?: BackButtonType = BackButtonType.secondary;
  @Input() disabled = false;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  buttonSize = ButtonSize;
  icons = Icons;
  iconSize = IconSize;
  iconColor = IconColor;

  constructor() {}

  onClick($event) {
    this.clicked.emit($event);
  }
}

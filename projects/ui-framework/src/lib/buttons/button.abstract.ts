import {
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ButtonType, ButtonSize, BackButtonType } from './buttons.enum';
import { Icons, IconColor, IconSize } from '../icons/icons.enum';

export abstract class BaseButtonElement {
  constructor() {}

  @ViewChild('button', { static: true }) public button: ElementRef;

  @Input() text: string;
  @Input() disabled = false;
  @Input() type: ButtonType | BackButtonType;
  @Input() size: ButtonSize;
  @Input() icon: Icons;

  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  onClick($event: MouseEvent) {
    if (this.clicked.observers.length > 0) {
      this.clicked.emit($event);
    }
  }
}

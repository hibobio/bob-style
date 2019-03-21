import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';
import { isEqual } from 'lodash';

@Component({
  selector: 'b-button',
  templateUrl: 'buttons.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnChanges {

  @Input() type?: ButtonType = ButtonType.primary;
  @Input() size?: ButtonSize = ButtonSize.medium;
  @Input() disabled = false;
  @Input() icon: Icons;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  iconColor: IconColor;
  iconSize: IconSize;

  constructor() {
  }

  ngOnChanges(): void {
    if (this.icon) {
      this.iconColor = isEqual(this.type, ButtonType.primary)
        ? IconColor.white
        : this.disabled ? IconColor.light : IconColor.dark;
      this.iconSize = isEqual(this.size, ButtonSize.large)
        ? IconSize.large
        : IconSize.medium;
    }
  }

  onClick($event) {
    this.clicked.emit($event);
  }
}

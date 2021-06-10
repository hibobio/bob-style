import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { isFunction } from '../../services/utils/functional-utils';
import { EmptyStateConfig } from './empty-state.interface';

@Component({
  selector: 'b-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  constructor() {}

  @Input() config: EmptyStateConfig;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter();

  readonly iconSize = IconSize;
  readonly iconColor: IconColor = IconColor.light;
  readonly buttonType: ButtonType = ButtonType.secondary;
  readonly buttonSize: ButtonSize = ButtonSize.medium;

  onButtonClick() {
    if (isFunction(this.config?.buttonClick)) {
      this.config.buttonClick();
    }
    this.buttonClick.emit();
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { EmptyStateConfig } from './empty-state.interface';
import { isFunction } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  constructor() {}

  @Input() config: EmptyStateConfig;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

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

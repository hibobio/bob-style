import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IconColor, Icons, IconSize} from '../../icons/icons.enum';
import {ButtonSize, ButtonType} from '../buttons/buttons.enum';

@Component({
  selector: 'b-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() public icon: Icons;
  @Input() public text: string;
  @Input() public buttonLabel: string;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
  readonly iconSize: IconSize = IconSize.xxLarge;
  readonly iconColor: IconColor = IconColor.light;
  readonly buttonType: ButtonType = ButtonType.secondary;
  readonly buttonSize: ButtonSize = ButtonSize.medium;

  constructor() { }

  public onClick(): void {
    this.buttonClick.emit();
  }
}

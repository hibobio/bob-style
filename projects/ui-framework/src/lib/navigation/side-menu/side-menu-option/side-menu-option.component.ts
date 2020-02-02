import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SideMenuOption } from './side-menu-option.interface';
import { IconColor, Icons } from '../../../icons/icons.enum';
import { ButtonType } from '../../../buttons/buttons.enum';

@Component({
  selector: 'b-side-menu-option, [b-side-menu-option]',
  templateUrl: './side-menu-option.component.html',
  styleUrls: ['./side-menu-option.component.scss'],
})
export class SideMenuOptionComponent {
  @Input() option: SideMenuOption;
  @Input() selected: boolean;
  @Output() selectOption: EventEmitter<any> = new EventEmitter<any>();

  public icons = Icons;
  public colors = IconColor;
  public types = ButtonType;
  public menuOpened: boolean;

  public showActions = false;

  constructor() {}

  onSelectOption(): void {
    this.selectOption.emit(this.option.id);
  }

  setShowActions(status: boolean): void {
    this.showActions = status;
  }

  onActionClick(): void {
    this.setShowActions(false);
  }
}

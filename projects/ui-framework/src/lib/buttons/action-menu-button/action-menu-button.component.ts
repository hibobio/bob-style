import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { ButtonType } from '../../buttons/buttons.enum';
import { IconColor, Icons } from '../../icons/icons.enum';
import { MenuItem } from '../../navigation/menu/menu.interface';
import { hasChanges } from '../../services/utils/functional-utils';
import { Button, ButtonConfig } from '../buttons.interface';

@Component({
  selector: 'b-action-menu-button',
  templateUrl: './action-menu-button.component.html',
  styleUrls: ['./action-menu-button.component.scss'],
})
export class ActionMenuButtonComponent implements OnChanges {
  @Input() menuItems: MenuItem[];
  @Input() openLeft: boolean;
  @Input() buttonConfig: ButtonConfig;
  @Output() actionClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

  readonly button: Button = {
    type: ButtonType.tertiary,
    icon: Icons.three_dots_vert,
    color: IconColor.normal,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, ['buttonConfig'], true)) {
      Object.assign(this.button, this.buttonConfig);
    }
  }

  public onActionClicked(event: MenuItem): void {
    this.actionClick.emit(event);
  }
}

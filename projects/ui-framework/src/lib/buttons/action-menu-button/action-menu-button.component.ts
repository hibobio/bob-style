import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { MenuItem } from '../../navigation/menu/menu.interface';
import { hasChanges } from '../../services/utils/functional-utils';
import { Button, ButtonConfig } from '../buttons.interface';
import { BUTTON_CONFIG } from '../common-buttons.const';

@Component({
  selector: 'b-action-menu-button',
  templateUrl: './action-menu-button.component.html',
  styleUrls: ['./action-menu-button.component.scss'],
})
export class ActionMenuButtonComponent implements OnChanges {
  @Input() id: string;
  @Input() menuItems: MenuItem[];
  @Input() openLeft: boolean;
  @Input() buttonConfig: Button | ButtonConfig;
  @Input() swallow = true;

  @Output() openMenu: EventEmitter<string | void> = new EventEmitter();
  @Output() closeMenu: EventEmitter<string | void> = new EventEmitter();
  @Output() actionClick: EventEmitter<MenuItem> = new EventEmitter();

  @HostBinding('attr.data-menu-open') menuOpen = false;

  public button: Button = BUTTON_CONFIG.trigger;

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, ['buttonConfig'], true)) {
      this.button = { ...this.button, ...this.buttonConfig };
    }
  }
}

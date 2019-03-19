import {
  Component,
  Input,
  HostBinding
} from '@angular/core';

import { MenuItem } from '../../navigation/menu/menu.interface';

@Component({
  selector: 'b-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  constructor() {}

  @Input() text = '';
  @Input() menu?: MenuItem[];
  @HostBinding('class.focusInside') menuIsOpened: boolean;

  onMenuOpen(): void {
    this.menuIsOpened = true;
  }

  onMenuClose(): void {
    setTimeout(() => {
      this.menuIsOpened = false;
    }, 300);
  }
}

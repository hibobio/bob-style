import {
  Component,
  Input,
  OnInit,
  ViewChild,
  HostBinding
} from '@angular/core';

import { MenuItem } from '../../navigation/menu/menu.interface';

@Component({
  selector: 'b-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() text = '';
  @Input() menu: MenuItem[];
  @HostBinding('class.focusInside') menuIsOpened: boolean;

  constructor() {}

  ngOnInit() {}

  onMenuOpen(): void {
    this.menuIsOpened = true;
  }

  onMenuClose(): void {
    this.menuIsOpened = false;
  }
}

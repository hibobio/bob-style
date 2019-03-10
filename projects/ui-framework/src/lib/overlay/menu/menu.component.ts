import { Component, Input, ViewChild } from '@angular/core';
import { MenuItem } from './menu.interface';

@Component({
  selector: 'b-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  @Input() menu: MenuItem[];
  @ViewChild('childMenu') public childMenu;

  constructor() {
  }
}

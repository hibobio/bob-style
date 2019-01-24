import { Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'b-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  @Input() actionsModel: any[];
  @ViewChild('childMenu') public childMenu;

  constructor() {
  }
}

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MenuItem } from './menu.interface';

@Component({
  selector: 'b-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  @Input() menu: MenuItem[];
  @Output() actionClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('childMenu') public childMenu;

  constructor() {
  }

  onClick($event, child): void {
    child.action($event);
    this.actionClick.emit();
  }

  onCloseMenu(): void {
    this.closeMenu.emit();
  }
}

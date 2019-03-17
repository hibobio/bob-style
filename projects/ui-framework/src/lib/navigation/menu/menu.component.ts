import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem } from './menu.interface';
import { MenuPositionX } from '@angular/material';

@Component({
  selector: 'b-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Input() menu: MenuItem[];
  @Input() openLeft = false;
  @Output() actionClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('childMenu') public childMenu;

  menuDir: MenuPositionX;

  constructor() {
  }

  ngOnInit(): void {
    this.menuDir = this.openLeft ? 'before' : 'after';
  }

  onClick($event, child): void {
    child.action($event);
    this.actionClick.emit();
  }

  onCloseMenu(): void {
    this.closeMenu.emit();
  }
}

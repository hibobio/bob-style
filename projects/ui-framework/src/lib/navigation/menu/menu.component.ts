import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MenuItem } from './menu.interface';
import { MenuPositionX } from '@angular/material';
import { has } from 'lodash';

@Component({
  selector: 'b-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnChanges {

  @Input() menu: MenuItem[];
  @Input() openLeft = false;
  @Input() disabled: boolean;
  @Output() actionClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() openMenu: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('childMenu') public childMenu;

  menuDir: MenuPositionX = 'after';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'openLeft')) {
      this.openLeft = changes.openLeft.currentValue;
      this.menuDir = this.openLeft
        ? 'before'
        : 'after';
    }
    if (has(changes, 'disabled')) {
      this.disabled = changes.disabled.currentValue;
    }
  }

  onClick($event, child): void {
    child.action($event);
    this.actionClick.emit();
  }

  onOpenMenu(): void {
    this.openMenu.emit();
  }

  onCloseMenu(): void {
    this.closeMenu.emit();
  }
}

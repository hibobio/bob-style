import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MenuItem } from './menu.interface';
import { MenuPositionX } from '@angular/material/menu';
import { has } from 'lodash';

@Component({
  selector: 'b-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnChanges {
  @Input() id: string;
  @Input() menu: MenuItem[];
  @Input() openLeft = false;
  @Input() disabled: boolean;
  @Output() actionClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
  @Output() openMenu: EventEmitter<string | void> = new EventEmitter<
    string | void
  >();
  @Output() closeMenu: EventEmitter<string | void> = new EventEmitter<
    string | void
  >();

  @ViewChild('childMenu', { static: true }) public childMenu;

  menuDir: MenuPositionX = 'after';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'openLeft')) {
      this.openLeft = changes.openLeft.currentValue;
      this.menuDir = this.openLeft ? 'before' : 'after';
    }
    if (has(changes, 'disabled')) {
      this.disabled = changes.disabled.currentValue;
    }
  }

  onClick(child: MenuItem, triggerAction = true): void {
    const childUpd = Object.assign({}, child, this.id ? { id: this.id } : {});

    if (this.actionClick.observers.length > 0) {
      this.actionClick.emit(childUpd);
    }

    if (child.action && triggerAction) {
      child.action(childUpd);
    }
  }

  onOpenMenu(): void {
    if (this.openMenu.observers.length > 0) {
      this.openMenu.emit(this.id || null);
    }
  }

  onCloseMenu(): void {
    if (this.closeMenu.observers.length > 0) {
      this.closeMenu.emit(this.id || null);
    }
  }
}

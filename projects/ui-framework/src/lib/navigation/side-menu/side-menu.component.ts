import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SideMenuOption } from './side-menu-option/side-menu-option.interface';

@Component({
  selector: 'b-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  @Input() options: SideMenuOption[];
  @Input() selectedId: number | string = null;
  @Input() headerLabel: string;
  @Output() selectOption: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  onSelectOption(id: number): void {
    this.selectedId = id;
    this.selectOption.emit(id);
  }
}

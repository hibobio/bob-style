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

  @Output() selectOption: EventEmitter<number | string> = new EventEmitter<
    number | string
  >();

  constructor() {}

  public onSelectOption(id: number | string): void {
    this.selectedId = id;
    this.selectOption.emit(id);
  }

  public trackBy(index: number, item: SideMenuOption): string {
    return (
      (item.id !== undefined && item.id + '') ||
      (item.displayName || '') + index
    );
  }
}

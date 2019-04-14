import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SideMenuOption } from './side-menu-option/side-menu-option.interface';
import head from 'lodash/head';
import size from 'lodash/size';
import isNull from 'lodash/isNull';

@Component({
  selector: 'b-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnChanges {
  @Input() options: SideMenuOption[];
  @Input() selectedId: string = null;
  @Output() selectOption: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnChanges() {
    if (size(this.options) && isNull(this.selectedId)) {
      this.onSelectOption(head(this.options).id);
    }
  }

  onSelectOption(id: string): void {
    this.selectedId = id;
    this.selectOption.emit(id);
  }

}

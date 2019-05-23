import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SideMenuOption } from './side-menu-option/side-menu-option.interface';
import head from 'lodash/head';
import size from 'lodash/size';
import isNull from 'lodash/isNull';
import find from 'lodash/find';

@Component({
  selector: 'b-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnChanges {
  @Input() options: SideMenuOption[];
  @Input() selectedId: number = null;
  @Output() selectOption: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  ngOnChanges() {
    if (size(this.options)) {
      if (isNull(this.selectedId) || !find(this.options, { id: this.selectedId })) {
        this.onSelectOption(head(this.options).id);
      }
    }
  }

  onSelectOption(id: number): void {
    this.selectedId = id;
    this.selectOption.emit(id);
  }

}

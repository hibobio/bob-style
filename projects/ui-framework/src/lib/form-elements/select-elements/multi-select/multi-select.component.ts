import { Component, Input } from '@angular/core';
import { SelectGroupOption } from '../select/select.interface';

@Component({
  selector: 'b-multi-select',
  templateUrl: './multi-select.component.html',
})
export class MultiSelectComponent {

  @Input() options: SelectGroupOption[];
  @Input() selectedIds: (string | number)[];
  @Input() showSingleGroupHeader = false;

  constructor() {
  }
}

import { Component, Input } from '@angular/core';
import { SelectGroupOption } from '../select/select.interface';

@Component({
  selector: 'b-single-select',
  templateUrl: './single-select.component.html',
})
export class SingleSelectComponent {

  @Input() options: SelectGroupOption[] = [];
  @Input() selectedId: (string | number);
  @Input() showSingleGroupHeader = false;

  constructor() {
  }
}

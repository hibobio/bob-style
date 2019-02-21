import { Component, Input } from '@angular/core';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';

const optionsMock: SelectGroupOption[] = Array.from(Array(3), (_, i) => {
  return {
    groupName: `Basic Info G${ i } - header`,
    options: Array.from(Array(4), (_, k) => {
      return {
        value: `Basic Info G${ i }_E${ k } - option`,
        id: i * 4 + k,
      };
    })
  };
});

@Component({
  selector: 'b-quick-filter',
  templateUrl: './quick-filter.component.html',
  styleUrls: ['./quick-filter.component.scss'],
})
export class QuickFilterComponent {

  @Input() label = 'Department';
  @Input() showSingleGroupHeader = false;
  @Input() options: SelectGroupOption[] = optionsMock;
  @Input() value: any = [];

  hasValue = false;

  constructor() {
  }

  multiSelectChange(value: (string | number)[]): void {
    console.log('apply value', value);
  }

  multiSelectModified(value: (string | number)[]): void {
    console.log('modify value', value);
    this.hasValue = value.length > 0;
  }
}

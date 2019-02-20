import { Component } from '@angular/core';
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

  label = 'Department';
  options: SelectGroupOption[] = optionsMock;
  value = [];
  showSingleGroupHeader = false;

  constructor() {
  }

  selectChange($event): void {
    console.log('$event');
  }
}

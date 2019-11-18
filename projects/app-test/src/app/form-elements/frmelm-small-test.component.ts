import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { optionsMock } from '../../../../ui-framework/src/lib/form-elements/lists/single-list/single-list.mock';
import { cloneDeep } from 'lodash';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'form-elem-small-test',
  template: `
    <form [formGroup]="testForm" style="max-width: 800px; margin: 100px auto;">
      <b-datepicker formControlName="datePicker"></b-datepicker>
      <br />
      <b-split-input-single-select
        [selectOptions]="splitInpSelOptions"
        formControlName="splitInpSel"
      ></b-split-input-single-select>
      <br />
      <b-date-range-picker
        formControlName="dateRangePicker"
      ></b-date-range-picker>
      <br />
      <b-timepicker formControlName="timePicker"></b-timepicker>
    </form>
  `,
  styles: [':host {display: block;}'],
})
export class FormElemSmallTestComponent implements OnInit {
  constructor() {}

  testForm = new FormGroup({
    datePicker: new FormControl(),
    splitInpSel: new FormControl(),
    dateRangePicker: new FormControl(),
    timePicker: new FormControl(),
  });

  elems = ['datePicker', 'splitInpSel', 'dateRangePicker', 'timePicker'];

  splitInpSelOptions = cloneDeep(optionsMock);

  ngOnInit() {
    this.elems.forEach(key => {
      this.testForm.get(key).valueChanges.subscribe(value => {
        console.log(key + ':', value);
      });
    });
  }
}

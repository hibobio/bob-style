import { Component, Input, OnInit } from '@angular/core';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'b-datepicker-input',
  templateUrl: '../input/input.component.html',
  template: InputComponent.addAttributesToBaseInput('[matDatepicker]="datePickerId"'),
  styleUrls: ['../input/input.component.scss']
})
export class DatepickerInputComponent extends InputComponent implements OnInit {

  @Input() datePickerId: string;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}

import { Component, Input } from '@angular/core';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'b-datepicker-input',
  template: InputComponent.addAttributesToBaseInput('[matDatepicker]="datePickerId"'),
  styleUrls: ['../input/input.component.scss']
})
export class DatepickerInputComponent extends InputComponent {

  @Input() datePickerId: string;

  constructor() {
    super();
  }
}

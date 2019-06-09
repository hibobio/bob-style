import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { RadioDirection } from './radio-button.enum';
import { InputEventType } from '../input/input.enum';
import { RadioConfig } from './radio-button.interface';

@Component({
  selector: 'b-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    }
  ]
})
export class RadioButtonComponent extends BaseFormElement {
  @Input() value: string;
  @Input() options: string[] | RadioConfig[];
  @Input() direction: RadioDirection = RadioDirection.row;

  public dir = RadioDirection;

  @Output() radioChange: EventEmitter<number | string> = new EventEmitter<
    number | string
  >();

  constructor() {
    super();
  }

  compare(a: string | number, b: string | number) {
    return parseInt(a as string, 10) === parseInt(b as string, 10);
  }

  onRadioChange(event): void {
    this.value = (this.options as any)[0].id
      ? parseInt(event.target.value, 10)
      : event.target.value;

    this.transmitValue(this.value, [InputEventType.onBlur], 'radioChange');
  }
}

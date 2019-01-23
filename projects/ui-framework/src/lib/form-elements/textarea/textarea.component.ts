import { Component, forwardRef, Input } from '@angular/core';
import { InputEventType } from '../input/input.enum';
import { BaseInputElement } from '../base-input-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'b-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
})
export class TextareaComponent extends BaseInputElement {

  @Input() maxChars: number;

  eventType = InputEventType;

  constructor() {
    super();
  }
}

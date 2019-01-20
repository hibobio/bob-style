import { Component, Input } from '@angular/core';
import { InputEventType } from '../input/input.enum';
import { BaseInputElement } from '../base-input-element';

@Component({
  selector: 'b-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent extends BaseInputElement {

  @Input() maxChars: number;

  eventType = InputEventType;

  constructor() {
    super();
  }
}

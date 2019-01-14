import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { InputAutoCompleteOptions, InputEventType, InputTypes } from './input.enum';
import { inputAttributesPlaceholder } from '../../consts';
import { MatInput } from '@angular/material';
import { InputEvent } from './input.interface';

export const baseInputTemplate = require('./input.component.html');

@Component({
  selector: 'b-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {

  @Input() inputType: InputTypes;
  @Input() placeholder: string;
  @Input() value: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() hideLabelOnFocus = false;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions = InputAutoCompleteOptions.off;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();

  @ViewChild('bInput') bInput: MatInput;
  eventType = InputEventType;

  constructor() {
  }

  static addAttributesToBaseInput(attributes: string): string {
    return baseInputTemplate.replace(inputAttributesPlaceholder, attributes);
  }

  ngOnInit() {
  }

  emitInputEvent(
    event: InputEventType,
    value: string | number,
  ): void {
    this.inputEvents.emit({
      event,
      value,
    });
  }
}

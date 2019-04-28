import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { MatRadioChange } from '@angular/material';
import has from 'lodash/has';
import { RadioConfig } from './radio-button.interface';
import { RadioDirection } from './radio-button.enum';

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
  ],
})
export class RadioButtonComponent extends BaseFormElement implements OnChanges {
  @Input() value: number = null;
  @Input() radioConfig: RadioConfig[];
  @Input() direction: RadioDirection = RadioDirection.row;
  @Output() radioChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'value')) {
      this.value = changes.value.currentValue;
    }
  }

  onRadioChange(e: MatRadioChange): void {
    this.radioChange.emit(e.value);
    this.propagateChange(e.value);
  }
}

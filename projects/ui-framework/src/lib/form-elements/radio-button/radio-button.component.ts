import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseFormElement} from '../base-form-element';

export interface RadioDataModel {
 id: string;
 value: string;
}

export enum RadioDirection {
  row = 'row',
  column = 'column'
}

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
export class RadioButtonComponent extends BaseFormElement {

  @Input() label: string;
  @Input() value: boolean;
  @Input() selected: boolean;
  @Input() labelPosition: string;
  @Input() disabled: boolean;
  @Input() model: string;
  @Input() radioDataModel: RadioDataModel[] = [{id: '1', value: 'radioOne'}, {id: '2', value: 'radioTwo'}];
  @Input() radioDirection: RadioDirection;
  @Output() radioChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    super();
  }
}

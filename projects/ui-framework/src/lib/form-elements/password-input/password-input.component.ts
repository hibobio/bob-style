import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Output,
  ViewChild
} from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InputTypes } from '../input/input.enum';
import { InputEvent } from '../input/input.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../base-input-element';

@Component({
  selector: 'b-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: [
    '../input/input.component.scss',
    './password-input.component.scss'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent extends BaseInputElement {
  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly inputTypes = InputTypes;
  public inputType = InputTypes.password;

  @ViewChild('input', { static: true }) input: ElementRef;

  constructor() {
    super();
    this.outputTransformers = [];
  }

  isInputEmpty(): boolean {
    return !this.value || this.value.length === 0;
  }

  switchInputType(): void {
    this.inputType =
      this.inputType === InputTypes.password
        ? InputTypes.text
        : InputTypes.password;
  }
}

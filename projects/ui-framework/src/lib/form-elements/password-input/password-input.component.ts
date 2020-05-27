import {
  Component,
  forwardRef,
  NgZone,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InputTypes } from '../input/input.enum';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../base-input-element';

@Component({
  selector: 'b-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: [
    '../input/input.component.scss',
    './password-input.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
})
export class PasswordInputComponent extends BaseInputElement {
  constructor(cd: ChangeDetectorRef, zone: NgZone) {
    super(cd, zone);
    this.outputTransformers = [];
  }

  @Input() minChars = 4;
  @Input() maxChars = 30;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  public inputType = InputTypes.password;

  public isInputEmpty(): boolean {
    return !this.value || this.value.trim() === '';
  }

  public switchInputType(): void {
    this.inputType =
      this.inputType === InputTypes.password
        ? InputTypes.text
        : InputTypes.password;
    this.cd.detectChanges();
    this.focus(true);
  }
}

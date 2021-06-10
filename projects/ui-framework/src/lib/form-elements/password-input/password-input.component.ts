import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Icon } from '../../icons/icon.interface';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { applyChanges } from '../../services/utils/functional-utils';
import { BaseFormElement } from '../base-form-element';
import { BaseInputElement } from '../base-input-element';
import { InputAutoCompleteOptions, InputTypes } from '../input/input.enum';

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
    { provide: BaseFormElement, useExisting: PasswordInputComponent },
  ],
})
export class PasswordInputComponent
  extends BaseInputElement
  implements OnChanges {
  constructor(cd: ChangeDetectorRef, zone: NgZone) {
    super(cd, zone);
  }

  @Input() minChars = 4;
  @Input() maxChars = 30;

  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.newPassword;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  readonly showIcn: Icon = {
    size: IconSize.medium,
    color: IconColor.dark,
    hasHoverState: true,
  };

  public inputType = InputTypes.password;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes, {
      enableBrowserAutoComplete: InputAutoCompleteOptions.newPassword,
    });
    super.ngOnChanges(changes);
  }

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

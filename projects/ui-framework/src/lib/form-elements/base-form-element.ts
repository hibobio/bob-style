import { Input } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';

export abstract class BaseFormElement implements ControlValueAccessor {

  @Input() label: string;
  @Input() value: any;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() hideLabelOnFocus = false;
  @Input() hintMessage: string;
  @Input() errorMessage: string;

  @Input() validateFn: Function = (_: FormControl) => {
  };

  propagateChange: Function = (_: any) => {
  };

  registerOnChange(fn: any): void {
    console.log('registerOnChange', fn);
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log('registerOnTouched', fn);
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('setDisabledState', isDisabled);
    this.disabled = isDisabled;
  }

  writeValue(val: any): void {
    console.log('writeValue', val);
    this.value = val;
  }

  validate(c: FormControl) {
    console.log('validate', c);
    return this.validateFn(c);
  }
}

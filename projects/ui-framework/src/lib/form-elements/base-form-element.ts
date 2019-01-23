import { Input } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';

export abstract class BaseFormElement implements ControlValueAccessor {

  @Input() value: any;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() validateFn: Function = (_: FormControl) => {
  };

  propagateChange: Function = (_: any) => {
  };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(val: any): void {
    this.value = val;
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }
}

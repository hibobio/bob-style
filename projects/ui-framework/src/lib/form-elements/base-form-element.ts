import { Input } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { InputEvent } from './input/input.interface';

export abstract class BaseFormElement implements ControlValueAccessor {

  @Input() value: any;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() validateFn: Function = (_: FormControl) => {
  };

  propagateChange: Function = (_: InputEvent) => {
  };

  registerOnChange(fn: any): void {
    console.log('registerOnChange fn', fn);
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log('registerOnTouched fn', fn);
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('setDisabledState isDisabled', isDisabled);
    this.disabled = isDisabled;
  }

  writeValue(val: any): void {
    console.log('writeValue val', val);
    this.value = val;
  }

  validate(c: FormControl) {
    console.log('validate formControl', c);
    return this.validateFn(c);
  }
}

import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { forwardRef } from '@angular/core';
import { ComponentInstance } from '@angular/core/src/render3/interfaces/player';

export const formElementProviders = (component: ComponentInstance) => {
  return [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => component),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => component),
      multi: true
    }
  ];
};

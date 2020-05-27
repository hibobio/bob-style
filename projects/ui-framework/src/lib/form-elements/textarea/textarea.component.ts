import {
  Component,
  forwardRef,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { BaseInputElement } from '../base-input-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'b-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['../input/input.component.scss', './textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent extends BaseInputElement {
  constructor(cd: ChangeDetectorRef, zone: NgZone) {
    super(cd, zone);
    this.outputTransformers = [];
  }
}

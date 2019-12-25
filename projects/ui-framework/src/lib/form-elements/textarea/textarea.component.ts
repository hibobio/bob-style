import {
  Component,
  forwardRef,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { BaseInputElement } from '../base-input-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';

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
  constructor(
    cd: ChangeDetectorRef,
    zone: NgZone,
    kbrdCntrlSrvc: FormElementKeyboardCntrlService
  ) {
    super(cd, zone, kbrdCntrlSrvc);
    this.outputTransformers = [];
  }
}

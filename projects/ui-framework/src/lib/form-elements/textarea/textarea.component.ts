import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  NgZone,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { HtmlParserHelpers } from '../../services/html/html-parser.service';
import { BaseFormElement } from '../base-form-element';
import { BaseInputElement } from '../base-input-element';

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
    { provide: BaseFormElement, useExisting: TextareaComponent },
  ],
})
export class TextareaComponent extends BaseInputElement {
  constructor(
    cd: ChangeDetectorRef,
    zone: NgZone,
    private parserService: HtmlParserHelpers
  ) {
    super(cd, zone);
    this.inputTransformers.push((value: string): string => {
      return this.parserService.getPlainText(value);
    });
  }
}

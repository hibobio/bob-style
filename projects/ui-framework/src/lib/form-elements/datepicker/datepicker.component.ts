import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  NgZone,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SERVER_DATE_FORMAT } from '../../consts';
import { dateOrFail, dateToString } from '../../services/utils/transformers';
import { MobileService } from '../../services/utils/mobile.service';
import { BaseDatepickerElement } from './datepicker.abstract';
import { DateParseService } from './date-parse.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { WindowRef } from '../../services/utils/window-ref.service';
import { startOfMonth } from 'date-fns';
import { DatepickerType } from './datepicker.enum';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';
import { BaseFormElement } from '../base-form-element';

@Component({
  selector: 'b-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['../input/input.component.scss', './datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: DatepickerComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent extends BaseDatepickerElement {
  constructor(
    windowRef: WindowRef,
    mobileService: MobileService,
    DOM: DOMhelpers,
    cd: ChangeDetectorRef,
    zone: NgZone,
    kbrdCntrlSrvc: FormElementKeyboardCntrlService,
    dateParseSrvc: DateParseService
  ) {
    super(
      windowRef,
      mobileService,
      DOM,
      cd,
      zone,
      kbrdCntrlSrvc,
      dateParseSrvc
    );

    this.inputTransformers = [dateOrFail];

    this.outputTransformers = [
      (value: Date): string =>
        value && this.type === DatepickerType.month
          ? dateToString(startOfMonth(value), SERVER_DATE_FORMAT)
          : dateToString(value, SERVER_DATE_FORMAT),
    ];

    this.baseValue = '';
  }

  @Input() value: Date | string = '';
}

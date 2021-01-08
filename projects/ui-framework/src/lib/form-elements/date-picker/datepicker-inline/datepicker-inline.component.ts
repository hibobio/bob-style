import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  Input,
  NgZone,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SERVER_DATE_FORMAT } from '../../../consts';
import { dateOrFail, dateToString } from '../../../services/utils/transformers';
import { MobileService } from '../../../services/utils/mobile.service';
import {
  BaseDatepickerElement,
  CLOSE_SCROLL_STRATEGY_FACTORY,
} from '../datepicker.abstract';
import { DateParseService } from '../date-parse-service/date-parse.service';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { WindowRef } from '../../../services/utils/window-ref.service';
import { FormElementKeyboardCntrlService } from '../../services/keyboard-cntrl.service';
import { BaseFormElement } from '../../base-form-element';
import { Overlay } from '@angular/cdk/overlay';
import { MAT_DATEPICKER_SCROLL_STRATEGY } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'b-datepicker-inline',
  templateUrl: './datepicker-inline.component.html',
  styleUrls: ['./datepicker-inline.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerInlineComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatepickerInlineComponent),
      multi: true,
    },
    {
      provide: MAT_DATEPICKER_SCROLL_STRATEGY,
      deps: [Overlay],
      useFactory: CLOSE_SCROLL_STRATEGY_FACTORY,
    },
    { provide: BaseFormElement, useExisting: DatepickerInlineComponent },
    DateParseService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerInlineComponent extends BaseDatepickerElement {
  constructor(
    protected windowRef: WindowRef,
    protected utilsService: UtilsService,
    protected mobileService: MobileService,
    protected DOM: DOMhelpers,
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected kbrdCntrlSrvc: FormElementKeyboardCntrlService,
    protected dateParseSrvc: DateParseService,
    protected dateAdapter: DateAdapter<any>
  ) {
    super(
      windowRef,
      utilsService,
      mobileService,
      DOM,
      cd,
      zone,
      kbrdCntrlSrvc,
      dateParseSrvc,
      dateAdapter
    );

    this.inputTransformers = [dateOrFail];

    this.outputTransformers = [
      (value: Date): string => dateToString(value, SERVER_DATE_FORMAT),
    ];

    this.baseValue = '';
  }

  @HostBinding('class.b-datepicker-panel') hostClass = true;

  @Input()
  value: Date | string = '';
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  NgZone
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { B_DATE_FORMATS, BDateAdapter } from '../datepicker/date.adapter';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { serverDateFormat } from '../../consts';
import {
  dateOrFail,
  dateToString,
  objectHasKeyOrFail
} from '../../services/utils/transformers';
import { cloneObject, simpleUID } from '../../services/utils/functional-utils';
import { BaseDatepickerElement } from '../datepicker/datepicker.abstract';
import { MobileService } from '../../services/utils/mobile.service';
import { DateParseService } from '../datepicker/date-parse.service';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { WindowRef } from '../../services/utils/window-ref.service';
import { DateRangePickerValue } from './date-range-picker.interface';
import {
  MAT_DATEPICKER_SCROLL_STRATEGY,
  MatDatepicker
} from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import { DatepickerType } from '../datepicker/datepicker.enum';
import { lastDayOfMonth, startOfMonth } from 'date-fns';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';

interface DateRangePickerValueLocal {
  startDate: Date | string;
  endDate: Date | string;
}

const valueDef: DateRangePickerValueLocal = {
  startDate: undefined,
  endDate: undefined
};

export function CLOSE_SCROLL_STRATEGY_FACTORY(overlay: Overlay) {
  const strategy = () => overlay.scrollStrategies.close();
  return strategy;
}

@Component({
  selector: 'b-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: [
    '../input/input.component.scss',
    '../datepicker/datepicker.component.scss',
    './date-range-picker.component.scss'
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: BDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: B_DATE_FORMATS
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    },
    {
      provide: MAT_DATEPICKER_SCROLL_STRATEGY,
      deps: [Overlay],
      useFactory: CLOSE_SCROLL_STRATEGY_FACTORY
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangePickerComponent extends BaseDatepickerElement
  implements AfterViewInit {
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

    this.inputTransformers = [
      objectHasKeyOrFail(['from', 'to'], true),
      (value: DateRangePickerValue): DateRangePickerValueLocal => {
        return value
          ? {
              startDate: dateOrFail(value.from),
              endDate: dateOrFail(value.to)
            }
          : cloneObject(valueDef);
      }
    ];

    this.outputTransformers = [
      (value: DateRangePickerValueLocal): DateRangePickerValue => {
        const from =
          value.startDate && this.type === DatepickerType.month
            ? dateToString(
                startOfMonth(value.startDate as Date),
                serverDateFormat
              )
            : dateToString(value.startDate, serverDateFormat);

        const to =
          value.endDate && this.type === DatepickerType.month
            ? dateToString(
                lastDayOfMonth(value.endDate as Date),
                serverDateFormat
              )
            : dateToString(value.endDate, serverDateFormat);

        return {
          from,
          to
        };
      }
    ];

    this.baseValue = valueDef;
  }

  @Input() value: DateRangePickerValueLocal;

  @Input() startDateLabel: string;
  @Input() endDateLabel: string;

  public idSD = simpleUID('bdp-sd-');
  public idED = simpleUID('bdp-ed-');

  ngAfterViewInit(): void {
    this.overlayStylesDef = {
      '--start-date-label':
        this.startDateLabel || this.label
          ? '"' + this.startDateLabel || this.label + '"'
          : null,
      '--end-date-label':
        this.endDateLabel || this.label
          ? '"' + this.endDateLabel || this.startDateLabel || this.label + '"'
          : null
    };
  }

  public getDateClass = (date: Date): string[] => {
    if (date) {
      let d: number, ds: number, de: number;

      if (this.type === DatepickerType.month) {
        d = startOfMonth(date).getTime();
        ds =
          this.value.startDate &&
          startOfMonth(this.value.startDate as Date).getTime();
        de =
          this.value.endDate &&
          startOfMonth(this.value.endDate as Date).getTime();
      } else {
        d = date.getTime();
        ds = this.value.startDate && (this.value.startDate as Date).getTime();
        de = this.value.endDate && (this.value.endDate as Date).getTime();
      }

      return ds && de && d > ds && d < de
        ? ['in-range']
        : d === ds && d === de
        ? ['in-range', 'only-in-range']
        : d === ds
        ? de
          ? ['in-range', 'first-in-range']
          : ['in-range', 'first-in-range', 'only-in-range']
        : d === de
        ? ds
          ? ['in-range', 'last-in-range']
          : ['in-range', 'last-in-range', 'only-in-range']
        : [];
    }
    return [];
  }

  protected doOnPickerOpen(picker: MatDatepicker<any>): void {
    if (this.type === DatepickerType.month) {
      this.zone.runOutsideAngular(() => {
        this.windowRef.nativeWindow.requestAnimationFrame(() => {
          const pickerCells = this.getPickerPanelElements(
            picker,
            '.mat-calendar-body-cell'
          );

          pickerCells.forEach((cell: HTMLElement) => {
            cell.classList.add(
              ...this.getDateClass(new Date(cell.getAttribute('aria-label')))
            );
          });
        });
      });
    }
  }
}

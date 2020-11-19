import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  NgZone,
  OnInit,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SERVER_DATE_FORMAT } from '../../../consts';
import {
  dateOrFail,
  dateToString,
  objectHasKeyOrFail,
} from '../../../services/utils/transformers';
import {
  cloneObject,
  simpleUID,
} from '../../../services/utils/functional-utils';
import {
  BaseDatepickerElement,
  CLOSE_SCROLL_STRATEGY_FACTORY,
} from '../datepicker.abstract';
import { MobileService } from '../../../services/utils/mobile.service';
import { DateParseService } from '../date-parse-service/date-parse.service';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { WindowRef } from '../../../services/utils/window-ref.service';
import { DateRangePickerValue } from '../datepicker.interface';
import { Overlay } from '@angular/cdk/overlay';
import { DatepickerType } from '../datepicker.enum';
import { startOfMonth } from 'date-fns';
import { FormElementKeyboardCntrlService } from '../../services/keyboard-cntrl.service';
import { BaseFormElement } from '../../base-form-element';
import {
  MAT_DATEPICKER_SCROLL_STRATEGY,
  MatDatepicker,
} from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { UtilsService } from '../../../services/utils/utils.service';

interface DateRangePickerValueLocal {
  startDate: Date | string;
  endDate: Date | string;
}

const DATERANGE_VALUE_DEF: DateRangePickerValueLocal = {
  startDate: undefined,
  endDate: undefined,
};

@Component({
  selector: 'b-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: [
    '../../input/input.component.scss',
    '../datepicker/datepicker.component.scss',
    './date-range-picker.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
    {
      provide: MAT_DATEPICKER_SCROLL_STRATEGY,
      deps: [Overlay],
      useFactory: CLOSE_SCROLL_STRATEGY_FACTORY,
    },
    { provide: BaseFormElement, useExisting: DateRangePickerComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent extends BaseDatepickerElement
  implements OnInit, AfterViewInit {
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

    this.inputTransformers = [
      objectHasKeyOrFail(['from', 'to'], true),
      (value: DateRangePickerValue): DateRangePickerValueLocal => {
        return value
          ? {
              startDate: dateOrFail(value.from),
              endDate: dateOrFail(value.to),
            }
          : cloneObject(DATERANGE_VALUE_DEF);
      },
    ];

    this.outputTransformers = [
      (value: DateRangePickerValueLocal): DateRangePickerValue => ({
        from: dateToString(value.startDate, SERVER_DATE_FORMAT),
        to: dateToString(value.endDate, SERVER_DATE_FORMAT),
      }),
    ];

    this.baseValue = cloneObject(DATERANGE_VALUE_DEF);
  }

  @Input() value: DateRangePickerValueLocal;

  @Input() startDateLabel: string;
  @Input() endDateLabel: string;

  public idSD = simpleUID('bdp-sd-');
  public idED = simpleUID('bdp-ed-');

  ngOnInit(): void {
    super.ngOnInit();

    this.subs.push(
      this.utilsService
        .getWindowClickEvent(true)
        .subscribe((event: MouseEvent) => {
          const target = event.target as HTMLElement;

          if (!target) {
            return;
          }

          if (
            this.type === DatepickerType.month &&
            target.matches(
              '.mat-calendar-next-button, .mat-calendar-previous-button'
            )
          ) {
            const panel = target.closest('.b-datepicker-panel');

            if (
              !panel.classList.contains(this.idSD) &&
              !panel.classList.contains(this.idED)
            ) {
              return;
            }

            const isStartDate = panel.classList.contains('start-date-picker');

            this.doOnPickerOpen(this.getPicker(isStartDate ? 0 : 1));
          }

          if (
            target.matches(
              `.${this.idSD}.start-date-picker .mat-calendar-body-cell-content`
            )
          ) {
            setTimeout(() => {
              this.zone.run(() => {
                this.openPicker(1);
              });
            }, 0);
          }
        })
    );
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.overlayStylesDef = {
      '--start-date-label':
        this.startDateLabel || this.label
          ? '"' + this.startDateLabel || this.label + '"'
          : null,
      '--end-date-label':
        this.endDateLabel || this.label
          ? '"' + this.endDateLabel || this.startDateLabel || this.label + '"'
          : null,
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
  };

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

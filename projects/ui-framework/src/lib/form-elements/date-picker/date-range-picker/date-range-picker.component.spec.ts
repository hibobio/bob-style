import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRangePickerComponent } from './date-range-picker.component';
import { UtilsService } from '../../../services/utils/utils.service';
import { MobileService } from '../../../services/utils/mobile.service';
import { DateParseService } from '../date-parse-service/date-parse.service';
import { EventManagerPlugins } from '../../../services/utils/eventManager.plugins';
import { IconsModule } from '../../../icons/icons.module';
import { InputMessageModule } from '../../input-message/input-message.module';
import {
  elementFromFixture,
  elementsFromFixture,
  getPseudoContent,
} from '../../../services/utils/test-helpers';
import {
  dateToString,
  stringToDate,
} from '../../../services/utils/transformers';
import { isDate, parseISO, endOfMonth } from 'date-fns';
import { DatepickerType } from '../datepicker.enum';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DateInputDirectiveModule } from '../date-input-directive/dateinput.directive.module';
import {
  utilsServiceStub,
  mobileServiceStub,
} from '../../../tests/services.stub.spec';
import { InputEventType } from '../../form-elements.enum';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { simpleChange } from '../../../services/utils/functional-utils';

describe('DateRangePickerComponent', () => {
  let fixture: ComponentFixture<DateRangePickerComponent>;
  let component: DateRangePickerComponent;
  let componentElem: HTMLElement;

  let pickers: MatDatepicker<any>[];
  let inputElems: HTMLInputElement[];
  let labelElems: HTMLElement[];
  let iconElems: HTMLElement[];
  let messageElem: HTMLElement;
  let pickerDateCellElems: HTMLElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        IconsModule,
        InputMessageModule,
        NoopAnimationsModule,
        DateInputDirectiveModule,
      ],
      declarations: [DateRangePickerComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceStub },
        { provide: MobileService, useValue: mobileServiceStub },
        DateParseService,
        EventManagerPlugins[0],
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DateRangePickerComponent);
        component = fixture.componentInstance;
        componentElem = fixture.nativeElement;

        component.ignoreEvents = [];
        component.startDateLabel = 'Start date';
        component.endDateLabel = 'End date';
        component.hintMessage = 'Hint';
        component.required = true;

        fixture.detectChanges();

        pickers = component.pickers.toArray();
        inputElems = component.inputs.toArray().map((i) => i.nativeElement);
        iconElems = elementsFromFixture(fixture, '.bfe-suffix .b-icon');
        labelElems = elementsFromFixture(fixture, '.bfe-label');
        messageElem = elementFromFixture(fixture, '[b-input-message]');

        pickers[0].startAt = parseISO('2019-09-01');
        pickers[1].startAt = parseISO('2019-09-01');

        spyOn(component.changed, 'emit');
        component.changed.subscribe(() => {});
        spyOn(component, 'propagateChange');
      });
  }));

  afterEach(() => {
    component.changed.complete();
  });

  describe('OnInit', () => {
    it('should not display clear buttons when inputs are empty', () => {
      expect(iconElems[0].parentElement.parentElement.hidden).toBeTruthy();
      expect(iconElems[1].parentElement.parentElement.hidden).toBeTruthy();
    });
  });

  describe('Basic inputs', () => {
    it('should display Start date label', () => {
      expect(labelElems[0].innerText).toContain('Start date');
      expect(getPseudoContent(labelElems[0], 'after')).toContain('*');
    });

    it('should display End date label', () => {
      expect(labelElems[1].innerText).toContain('End date');
      expect(getPseudoContent(labelElems[1], 'after')).toContain('*');
    });

    it('should display hint message', () => {
      expect(messageElem.innerText).toContain('Hint');
    });
  });

  describe('Input messages', () => {
    it('should display error message', () => {
      component.ngOnChanges(
        simpleChange({
          errorMessage: 'Error',
        })
      );
      fixture.detectChanges();

      expect(componentElem.classList).toContain('error');
      expect(messageElem.innerText).toContain('Error');
    });
  });

  describe('Min/Max date', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          minDate: '2019-09-10',
          maxDate: '2019-09-25',
        })
      );
      fixture.detectChanges();
    });

    it('should set min date for MatDatepickers', () => {
      expect(dateToString(pickers[0]._minDate)).toEqual('2019-09-10');
      expect(dateToString(pickers[1]._minDate)).toEqual('2019-09-10');
    });

    it('should set max date for MatDatepickers', () => {
      expect(dateToString(pickers[1]._maxDate)).toEqual('2019-09-25');
      expect(dateToString(pickers[0]._maxDate)).toEqual('2019-09-25');
    });
  });

  describe('Value input', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          value: {
            from: '2019-09-15',
            to: '2019-09-27',
          },
        })
      );
      fixture.detectChanges();
    });

    it('should convert "to" string to "startDate" Date for internal use', () => {
      expect(isDate(component.value.startDate)).toBeTruthy();
      expect(dateToString(component.value.startDate)).toEqual('2019-09-15');
    });

    it('should convert "from" string to "endDate" Date for internal use', () => {
      expect(isDate(component.value.endDate)).toBeTruthy();
      expect(dateToString(component.value.endDate)).toEqual('2019-09-27');
    });

    it('should set max date of Start date MatDatepicker to "to" date', () => {
      expect(dateToString(pickers[0]._maxDate)).toEqual('2019-09-27');
      expect(dateToString(pickers[1]._maxDate)).not.toEqual('2019-09-27');
    });

    it('should set min date of End date MatDatepicker to "from" date', () => {
      expect(dateToString(pickers[1]._minDate)).toEqual('2019-09-15');
      expect(dateToString(pickers[0]._minDate)).not.toEqual('2019-09-15');
    });

    it('should emit changed event', () => {
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onWrite,
        value: {
          from: '2019-09-15',
          to: '2019-09-27',
        },
      });
      expect(component.propagateChange).toHaveBeenCalledWith({
        from: '2019-09-15',
        to: '2019-09-27',
      });
    });
  });

  describe('Clear button', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          value: {
            from: '2019-09-15',
            to: '2019-09-27',
          },
        })
      );
      fixture.detectChanges();
      iconElems = elementsFromFixture(fixture, '.bfe-suffix .b-icon');
    });

    it('should display clear icons, when inputs have values', () => {
      expect(iconElems[0].classList).toContain('b-icon-circle-cancel');
      expect(iconElems[1].classList).toContain('b-icon-circle-cancel');
    });

    it('should clear Start date value when clear button is clicked', () => {
      expect(component.value.startDate).not.toBeNull();
      iconElems[0].click();
      expect(component.value.startDate).toBeNull();
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: {
          from: null,
          to: '2019-09-27',
        },
        date: {
          startDate: null,
          endDate: stringToDate('2019-09-27'),
        },
      });
      expect(component.propagateChange).toHaveBeenCalledWith({
        from: null,
        to: '2019-09-27',
      });
    });

    it('should clear End date value when clear button is clicked', () => {
      expect(component.value.endDate).not.toBeNull();
      iconElems[1].click();
      expect(component.value.endDate).toBeNull();
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: {
          from: '2019-09-15',
          to: null,
        },
        date: {
          startDate: stringToDate('2019-09-15'),
          endDate: null,
        },
      });
      expect(component.propagateChange).toHaveBeenCalledWith({
        from: '2019-09-15',
        to: null,
      });
    });
  });

  describe('Panel', () => {
    describe('Min/Max date', () => {
      beforeEach(() => {
        component.ngOnChanges(
          simpleChange({
            minDate: '2019-09-10',
            maxDate: '2019-09-25',
          })
        );
        fixture.detectChanges();
      });

      it('should disable non-selectable dates in start date picker', () => {
        component.openPicker(0);
        fixture.detectChanges();
        pickerDateCellElems = component.getPickerPanelElements(
          pickers[0],
          '.mat-calendar-body .mat-calendar-body-cell'
        );

        expect(pickerDateCellElems[8].classList).toContain(
          'mat-calendar-body-disabled'
        );
        expect(pickerDateCellElems[9].classList).not.toContain(
          'mat-calendar-body-disabled'
        );
        component.closePicker(0);
      });

      it('should disable non-selectable dates in end date picker', () => {
        component.openPicker(1);
        fixture.detectChanges();
        pickerDateCellElems = component.getPickerPanelElements(
          pickers[1],
          '.mat-calendar-body .mat-calendar-body-cell'
        );

        expect(pickerDateCellElems[25].classList).toContain(
          'mat-calendar-body-disabled'
        );
        expect(pickerDateCellElems[24].classList).not.toContain(
          'mat-calendar-body-disabled'
        );
        component.closePicker(1);
      });
    });

    describe('Value input', () => {
      beforeEach(() => {
        component.ngOnChanges(
          simpleChange({
            value: {
              from: '2019-09-15',
              to: '2019-09-27',
            },
          })
        );
        fixture.detectChanges();
      });

      it('should disable non-selectable dates in start date picker', () => {
        component.openPicker(0);
        fixture.detectChanges();
        pickerDateCellElems = component.getPickerPanelElements(
          pickers[0],
          '.mat-calendar-body .mat-calendar-body-cell'
        );

        expect(pickerDateCellElems[27].classList).toContain(
          'mat-calendar-body-disabled'
        );
        expect(pickerDateCellElems[26].classList).not.toContain(
          'mat-calendar-body-disabled'
        );
        component.closePicker(0);
      });

      it('should disable non-selectable dates in end date picker', () => {
        component.openPicker(1);
        fixture.detectChanges();
        pickerDateCellElems = component.getPickerPanelElements(
          pickers[1],
          '.mat-calendar-body .mat-calendar-body-cell'
        );

        expect(pickerDateCellElems[13].classList).toContain(
          'mat-calendar-body-disabled'
        );
        expect(pickerDateCellElems[14].classList).not.toContain(
          'mat-calendar-body-disabled'
        );
        component.closePicker(1);
      });

      it('should mark the range in the start date picker', () => {
        component.openPicker(0);
        fixture.detectChanges();
        pickerDateCellElems = component.getPickerPanelElements(
          pickers[0],
          '.mat-calendar-body .in-range'
        );

        expect(pickerDateCellElems.length).toEqual(13);
        expect(pickerDateCellElems[0].classList).toContain('first-in-range');
        expect(pickerDateCellElems[0].innerHTML).toContain('15');
        expect(
          pickerDateCellElems[pickerDateCellElems.length - 1].classList
        ).toContain('last-in-range');
        expect(
          pickerDateCellElems[pickerDateCellElems.length - 1].innerHTML
        ).toContain('27');
        component.closePicker(0);
      });

      it('should mark the range in the end date picker', () => {
        component.openPicker(1);
        fixture.detectChanges();
        pickerDateCellElems = component.getPickerPanelElements(
          pickers[1],
          '.mat-calendar-body .in-range'
        );

        expect(pickerDateCellElems.length).toEqual(13);
        expect(pickerDateCellElems[0].classList).toContain('first-in-range');
        expect(pickerDateCellElems[0].innerHTML).toContain('15');
        expect(
          pickerDateCellElems[pickerDateCellElems.length - 1].classList
        ).toContain('last-in-range');
        expect(
          pickerDateCellElems[pickerDateCellElems.length - 1].innerHTML
        ).toContain('27');
        component.closePicker(1);
      });
    });

    describe('Partial value input', () => {
      describe('Start date', () => {
        beforeEach(() => {
          component.ngOnChanges(
            simpleChange({
              value: {
                from: '2019-09-15',
                to: null,
              },
            })
          );
          fixture.detectChanges();
        });

        it('should mark the range start in the start date picker', () => {
          component.openPicker(0);
          fixture.detectChanges();
          pickerDateCellElems = component.getPickerPanelElements(
            pickers[0],
            '.mat-calendar-body .first-in-range'
          );

          expect(pickerDateCellElems[0].innerHTML).toContain('15');
          expect(pickerDateCellElems[0].classList).toContain('only-in-range');
          component.closePicker(0);
        });

        it('should mark the range start in the end date picker', () => {
          component.openPicker(1);
          fixture.detectChanges();
          pickerDateCellElems = component.getPickerPanelElements(
            pickers[1],
            '.mat-calendar-body .first-in-range'
          );

          expect(pickerDateCellElems[0].innerHTML).toContain('15');
          expect(pickerDateCellElems[0].classList).toContain('only-in-range');
          component.closePicker(1);
        });
      });

      describe('End date', () => {
        beforeEach(() => {
          component.ngOnChanges(
            simpleChange({
              value: {
                from: null,
                to: '2019-09-27',
              },
            })
          );
          fixture.detectChanges();
        });

        it('should mark the range end in the start date picker', () => {
          component.openPicker(0);
          fixture.detectChanges();
          pickerDateCellElems = component.getPickerPanelElements(
            pickers[0],
            '.mat-calendar-body .last-in-range'
          );

          expect(pickerDateCellElems[0].innerHTML).toContain('27');
          expect(pickerDateCellElems[0].classList).toContain('only-in-range');
          component.closePicker(0);
        });

        it('should mark the range end in the end date picker', () => {
          component.openPicker(1);
          fixture.detectChanges();
          pickerDateCellElems = component.getPickerPanelElements(
            pickers[1],
            '.mat-calendar-body .last-in-range'
          );

          expect(pickerDateCellElems[0].innerHTML).toContain('27');
          expect(pickerDateCellElems[0].classList).toContain('only-in-range');
          component.closePicker(1);
        });
      });
    });
  });

  describe('Month range', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          type: DatepickerType.month,
        })
      );
      fixture.detectChanges();
    });

    it('should switch to month-picker mode', () => {
      expect(pickers[0].panelClass).not.toContain('type-date');
      expect(pickers[0].panelClass).toContain('type-month');
      expect(pickers[0].startView).toEqual('year');
      expect(pickers[1].panelClass).not.toContain('type-date');
      expect(pickers[1].panelClass).toContain('type-month');
      expect(pickers[1].startView).toEqual('year');
    });

    it('should set value in right format', () => {
      component.openPicker(0);
      fixture.detectChanges();
      pickerDateCellElems = component.getPickerPanelElements(
        pickers[0],
        '.mat-calendar-body td[aria-label*="Jan"]'
      );

      expect(pickerDateCellElems[0]).toBeTruthy();
      pickerDateCellElems[0].click();
      fixture.detectChanges();

      component.openPicker(1);
      fixture.detectChanges();
      pickerDateCellElems = component.getPickerPanelElements(
        pickers[1],
        '.mat-calendar-body td[aria-label*="Feb"]'
      );
      expect(pickerDateCellElems[0]).toBeTruthy();
      pickerDateCellElems[0].click();
      fixture.detectChanges();

      expect(component.value).toEqual({
        startDate: parseISO('2019-01-01'),
        endDate: endOfMonth(parseISO('2019-02-28')),
      });
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        date: {
          startDate: parseISO('2019-01-01'),
          endDate: endOfMonth(parseISO('2019-02-28')),
        },
        value: {
          from: '2019-01-01',
          to: '2019-02-28',
        },
      });
      expect(component.propagateChange).toHaveBeenCalledWith({
        from: '2019-01-01',
        to: '2019-02-28',
      });
      component.closePicker(0);
      component.closePicker(1);
    });
  });
});

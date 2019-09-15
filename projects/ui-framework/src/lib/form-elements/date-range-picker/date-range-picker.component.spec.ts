import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { DateRangePickerComponent } from './date-range-picker.component';
import { UtilsService } from '../../services/utils/utils.service';
import { MobileService } from '../../services/utils/mobile.service';
import createSpyObj = jasmine.createSpyObj;
import { DateTimeInputService } from '../datepicker/date-time-input.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { of } from 'rxjs';
import {
  MatDatepickerModule,
  MatNativeDateModule,
  MatDatepicker
} from '@angular/material';
import { IconsModule } from '../../icons/icons.module';
import { InputMessageModule } from '../input-message/input-message.module';
import {
  elementsFromFixture,
  elementFromFixture,
  getPseudoContent,
  simpleChange,
  inputValue
} from '../../services/utils/test-helpers';
import { dateToString, stringToDate } from '../../services/utils/transformers';
import isDate from 'date-fns/isDate';

describe('DateRangePickerComponent', () => {
  let fixture: ComponentFixture<DateRangePickerComponent>;
  let component: DateRangePickerComponent;
  let componentElem: HTMLElement;

  let pickers: MatDatepicker<any>[];
  let inputElems: HTMLInputElement[];
  let labelElems: HTMLElement[];
  let iconElems: HTMLElement[];
  let messageElem: HTMLElement;

  let utilsServiceStub: jasmine.SpyObj<UtilsService>;
  let mobileServiceStub: jasmine.SpyObj<MobileService>;

  beforeEach(async(() => {
    utilsServiceStub = createSpyObj('UtilsService', ['getResizeEvent']);
    utilsServiceStub.getResizeEvent.and.returnValue(of());

    mobileServiceStub = createSpyObj('MobileService', ['getMediaEvent']);
    mobileServiceStub.getMediaEvent.and.returnValue(of());

    TestBed.configureTestingModule({
      imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        IconsModule,
        InputMessageModule
      ],
      declarations: [DateRangePickerComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceStub },
        { provide: MobileService, useValue: mobileServiceStub },
        DateTimeInputService,
        EventManagerPlugins[0]
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(DateRangePickerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DateRangePickerComponent);
        component = fixture.componentInstance;
        componentElem = fixture.nativeElement;

        component.emitOnWrite = true;
        component.startDateLabel = 'Start date';
        component.endDateLabel = 'End date';
        component.hintMessage = 'Hint';
        component.required = true;

        fixture.detectChanges();

        pickers = component.pickers.toArray();
        inputElems = component.inputs.toArray().map(i => i.nativeElement);
        iconElems = elementsFromFixture(fixture, '.bfe-suffix .b-icon');
        labelElems = elementsFromFixture(fixture, '.bfe-label');
        messageElem = elementFromFixture(fixture, '[b-input-message]');

        spyOn(component.changed, 'emit');
      });
  }));

  describe('OnInit', () => {
    it('should not display clear buttons when inputs are empty', () => {
      expect(iconElems.length).toEqual(0);
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
      component.errorMessage = 'Error';
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
          maxDate: '2019-09-25'
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
            to: '2019-09-27'
          }
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

    it('should set Start date MatDatepicker to "from" date', () => {
      expect(isDate(pickers[0]._selected)).toBeTruthy();
      expect(dateToString(pickers[0]._selected)).toEqual('2019-09-15');
    });

    it('should set End date MatDatepicker to "to" date', () => {
      expect(isDate(pickers[1]._selected)).toBeTruthy();
      expect(dateToString(pickers[1]._selected)).toEqual('2019-09-27');
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
        event: 'onWrite',
        value: {
          from: '2019-09-15',
          to: '2019-09-27'
        }
      });
    });
  });

  describe('Keyboard input', () => {
    beforeEach(() => {
      inputValue(inputElems[0], '21.12.2012');
      inputValue(inputElems[1], '24-12-2012');
      fixture.detectChanges();
    });

    it('should pass properly entered Start date to MatDatepicker', () => {
      expect(isDate(pickers[0]._selected)).toBeTruthy();
      expect(dateToString(pickers[0]._selected)).toEqual('2012-12-21');
    });

    it('should pass properly entered End date to MatDatepicker', () => {
      expect(isDate(pickers[1]._selected)).toBeTruthy();
      expect(dateToString(pickers[1]._selected)).toEqual('2012-12-24');
    });
  });

  describe('Clear button', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          value: {
            from: '2019-09-15',
            to: '2019-09-27'
          }
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
        event: 'onBlur',
        value: {
          from: null,
          to: '2019-09-27'
        },
        date: {
          startDate: null,
          endDate: stringToDate('2019-09-27')
        }
      });
    });

    it('should clear End date value when clear button is clicked', () => {
      expect(component.value.endDate).not.toBeNull();
      iconElems[1].click();
      expect(component.value.endDate).toBeNull();
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: 'onBlur',
        value: {
          from: '2019-09-15',
          to: null
        },
        date: {
          startDate: stringToDate('2019-09-15'),
          endDate: null
        }
      });
    });
  });
});

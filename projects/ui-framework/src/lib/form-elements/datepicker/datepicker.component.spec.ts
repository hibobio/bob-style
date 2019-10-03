import {DatepickerComponent} from './datepicker.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ChangeDetectionStrategy, NO_ERRORS_SCHEMA} from '@angular/core';
import {MatDatepicker, MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import {elementFromFixture, getPseudoContent, inputValue, simpleChange} from '../../services/utils/test-helpers';
import {UtilsService} from '../../services/utils/utils.service';
import {of} from 'rxjs';
import {DateParseService} from './date-parse.service';
import {MobileService} from '../../services/utils/mobile.service';
import {EventManagerPlugins} from '../../services/utils/eventManager.plugins';
import {IconsModule} from '../../icons/icons.module';
import {InputMessageModule} from '../input-message/input-message.module';
import {dateToString} from '../../services/utils/transformers';
import {isDate, parseISO} from 'date-fns';
import {DatepickerType} from './datepicker.enum';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormElementKeyboardCntrlService} from '../services/keyboard-cntrl.service';
import {OverlayModule} from '@angular/cdk/overlay';
import {FormElementLabelModule} from '../form-element-label/form-element-label.module';
import createSpyObj = jasmine.createSpyObj;

fdescribe('DatepickerComponent', () => {
  let fixture: ComponentFixture<DatepickerComponent>;
  let component: DatepickerComponent;
  let componentElem: HTMLElement;
  let labelElem: HTMLElement;
  let inputElem: HTMLInputElement;
  let iconElem: HTMLElement;
  let messageElem: HTMLElement;
  let picker: MatDatepicker<any>;
  let pickerDateCellElem: HTMLElement;

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
        InputMessageModule,
        NoopAnimationsModule,
        OverlayModule,
        FormElementLabelModule,
      ],
      declarations: [DatepickerComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceStub },
        { provide: MobileService, useValue: mobileServiceStub },
        FormElementKeyboardCntrlService,
        DateParseService,
        EventManagerPlugins[0]
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(DatepickerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DatepickerComponent);
        component = fixture.componentInstance;
        componentElem = fixture.nativeElement;

        component.emitOnWrite = true;
        component.label = 'Label';
        component.hintMessage = 'Hint';
        component.required = true;

        fixture.detectChanges();

        labelElem = elementFromFixture(fixture, '.bfe-label .btt');
        inputElem = elementFromFixture(
          fixture,
          '.bfe-input'
        ) as HTMLInputElement;

        messageElem = elementFromFixture(fixture, '[b-input-message]');

        spyOn(component.changed, 'emit');
        spyOn(component, 'propagateChange');

        picker = component.pickers.toArray()[0];
        picker.startAt = parseISO('2019-09-01');
      });
  }));

  describe('Init & Basic inputs', () => {
    it('should display label', () => {
      expect(labelElem.innerText).toContain('Label');
      expect(getPseudoContent(labelElem, 'after')).toContain('*');
    });
    it('should display hint message', () => {
      expect(messageElem.innerText).toContain('Hint');
    });
    it('should start in date-picker mode', () => {
      expect(picker.panelClass).not.toContain('type-month');
      expect(picker.panelClass).toContain('type-date');
      expect(picker.startView).toEqual('month');
    });
    it('should display calendar icon', () => {
      iconElem = elementFromFixture(fixture, '.open-picker .b-icon');
      expect(iconElem).toBeTruthy();
      expect(iconElem.classList).toContain('b-icon-calendar');
    });
    it('should not display clear icon, when component has no value', () => {
      iconElem = elementFromFixture(fixture, '.clear-input .b-icon');
      expect(iconElem).toBeFalsy();
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

    it('should set min date for MatDatepicker', () => {
      expect(dateToString(picker._minDate)).toEqual('2019-09-10');
    });

    it('should set max date for MatDatepicker', () => {
      expect(dateToString(picker._maxDate)).toEqual('2019-09-25');
    });
  });

  describe('Value input', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          value: '2019-09-15'
        })
      );
      fixture.detectChanges();
    });

    it('should convert string to Date for internal use', () => {
      expect(isDate(component.value)).toBeTruthy();
      expect(dateToString(component.value)).toEqual('2019-09-15');
    });

    it('should set date for MatDatepicker', () => {
      expect(isDate(picker._selected)).toBeTruthy();
      expect(dateToString(picker._selected)).toEqual('2019-09-15');
    });

    it('should select date in MatDatepicker panel', () => {
      component.openPicker();
      fixture.detectChanges();
      pickerDateCellElem = component.getPickerPanelElements(
        picker,
        '.mat-calendar-body [aria-selected="true"]'
      )[0];
      expect(pickerDateCellElem).toBeTruthy();
      const selectedDate = dateToString(
        new Date(pickerDateCellElem.getAttribute('aria-label'))
      );
      expect(selectedDate).toEqual('2019-09-15');
      component.closePicker();
    });

    it('should emit changed event', () => {
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: 'onWrite',
        value: '2019-09-15'
      });
      expect(component.propagateChange).toHaveBeenCalledWith('2019-09-15');
    });
  });

  describe('Keyboard input', () => {
    beforeEach(() => {
      inputValue(inputElem, '24.12.2012');
      fixture.detectChanges();
    });

    it('should pass properly entered date to MatDatepicker', () => {
      expect(isDate(new Date(picker._selected))).toBeTruthy();
      expect(dateToString(new Date(picker._selected))).toEqual('2012-12-24');
    });
  });

  describe('Panel click input', () => {
    it('should select day 27', () => {
      component.openPicker();
      fixture.detectChanges();
      pickerDateCellElem = component.getPickerPanelElements(
        picker,
        '.mat-calendar-body td[aria-label*=" 27 "]'
      )[0];
      fixture.detectChanges();
      expect(component.value).toBeFalsy();
      pickerDateCellElem.click();
      fixture.detectChanges();
      expect((component.value as Date).getDate()).toEqual(27);
      expect(component.changed.emit).toHaveBeenCalled();
      expect(component.propagateChange).toHaveBeenCalled();
      component.closePicker();
    });
  });

  describe('Clear button', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          value: '2019-09-15'
        })
      );
      fixture.detectChanges();
      iconElem = elementFromFixture(fixture, '.clear-input .b-icon');
    });

    it('should display clear icon, when component has value', () => {
      expect(iconElem.classList).toContain('b-icon-circle-cancel');
    });

    it('should clear value when clear button is clicked', () => {
      expect(component.value).not.toBeNull();
      iconElem.click();
      expect(component.value).toBeNull();
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: 'onBlur',
        value: null,
        date: null
      });
      expect(component.propagateChange).toHaveBeenCalledWith(null);
    });
  });

  describe('Month picker', () => {
    beforeEach(() => {
      component.type = DatepickerType.month;
      component.ngOnChanges(
        simpleChange({
          value: '2019-09-15'
        })
      );
      fixture.detectChanges();
    });

    it('should switch to month-picker mode', () => {
      expect(picker.panelClass).not.toContain('type-date');
      expect(picker.panelClass).toContain('type-month');
      expect(picker.startView).toEqual('year');
    });

    it('should select month in MatDatepicker panel', () => {
      component.openPicker();
      fixture.detectChanges();
      pickerDateCellElem = component.getPickerPanelElements(
        picker,
        '.mat-calendar-body [aria-selected="true"]'
      )[0];
      expect(pickerDateCellElem).toBeTruthy();
      const selectedDate = dateToString(
        new Date(pickerDateCellElem.getAttribute('aria-label'))
      );
      expect(selectedDate).toEqual('2019-09-01');
      component.closePicker();
    });

    it('should set value in right format', () => {
      component.openPicker();
      fixture.detectChanges();
      pickerDateCellElem = component.getPickerPanelElements(
        picker,
        '.mat-calendar-body td[aria-label*=" Nov "]'
      )[0];
      expect(pickerDateCellElem).toBeTruthy();
      pickerDateCellElem.click();
      fixture.detectChanges();
      expect((component.value as Date).getMonth()).toEqual(10);
      expect((component.value as Date).getDate()).toEqual(1);
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: 'onBlur',
        date: component.value,
        value: '2019-11-01'
      });
      expect(component.propagateChange).toHaveBeenCalledWith('2019-11-01');
      component.closePicker();
    });
  });
});

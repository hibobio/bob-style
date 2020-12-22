import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';
import { InputEventType } from '../form-elements.enum';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InputMessageModule } from '../input-message/input-message.module';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { InputTypes } from './input.enum';
import {
  elementFromFixture,
  emitNativeEvent,
  inputValue,
} from '../../services/utils/test-helpers';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { Keys, NativeEvents } from '../../enums';
import { FormElementLabelModule } from '../form-element-label/form-element-label.module';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let inputElement: any;
  let buttonUpElement: any;
  let buttonDownElement: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        InputMessageModule,
        FormElementLabelModule,
      ],
      providers: [DOMhelpers, EventManagerPlugins[0]],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InputComponent);
        component = fixture.componentInstance;
        component.ignoreEvents = [];
        component.ngAfterViewInit = () => {};

        spyOn(component.changed, 'emit');
        component.changed.subscribe(() => {});
        spyOn(component, 'propagateChange');
      });
  }));

  afterEach(() => {
    component.changed.complete();
  });

  describe('emit InputEvent', () => {
    beforeEach(() => {
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    });
    it('should emitInputEvent on input focus with input value', () => {
      component.value = 'input value';
      inputElement.dispatchEvent(new Event('focus'));
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onFocus,
        value: 'input value',
      });
    });
    it('should emitInputEvent on input blur with input value', () => {
      component.value = 'input value';
      inputElement.dispatchEvent(new Event('blur'));
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: 'input value',
      });
    });
    it('should emit InputEvent on model change with input value', () => {
      inputValue(inputElement, 'change input value', false);
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: 'change input value',
      });
      expect(component.propagateChange).toHaveBeenCalledWith(
        'change input value'
      );
    });

    it(`should emit InputEvent on keydown, if there is a subscriber to the event; \
    Should not propagateChange.`, () => {
      component.value = 'change input value';
      emitNativeEvent(inputElement, NativeEvents.keydown, {
        key: Keys.enter,
      });
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onKey,
        value: 'change input value',
        key: Keys.enter,
      });
      expect(component.propagateChange).not.toHaveBeenCalled();
    });

    it('should NOT emit InputEvent on keydown, if there are no subscribers to the event', () => {
      component.changed.complete();
      emitNativeEvent(inputElement, NativeEvents.keydown, {
        key: Keys.enter,
      });
      expect(component.changed.emit).not.toHaveBeenCalled();
      expect(component.propagateChange).not.toHaveBeenCalled();
    });
  });

  describe('transforms', () => {
    it('should return input value as number', () => {
      component.inputType = InputTypes.number;
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      inputValue(inputElement, 500, false);
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: 500,
      });
      expect(component.propagateChange).toHaveBeenCalledWith(500);
    });
  });
  describe('Numeric input limits: user input', () => {
    beforeEach(() => {
      component.inputType = InputTypes.number;
      component.max = 30;
      component.min = 5;
      inputElement = elementFromFixture(fixture, '.bfe-input');
      fixture.detectChanges();
    });

    it(`should return upper limit if the input value is bigger, and bottom limit \
    if it was smaller`, () => {
      expect(component.value as any).not.toEqual(30);
      inputValue(inputElement, 500);
      expect(component.value as any).toEqual(30);
    });
    it('should return bottom limit if the input value is less than min', () => {
      expect(component.value as any).not.toEqual(5);
      inputValue(inputElement, 2);
      expect(component.value as any).toEqual(5);
    });
  });
  describe('Numeric limits: tickers', () => {
    beforeEach(() => {
      component.inputType = InputTypes.number;
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      component.step = 3;
      component.max = 6;
      component.min = 5;
      fixture.detectChanges();
    });

    it('should return the bottom limit on any tick that sets the value to be below min', () => {
      inputValue(inputElement, 7, false);
      buttonDownElement = elementFromFixture(fixture, '.b-icon-chevron-down');
      emitNativeEvent(buttonDownElement);
      fixture.detectChanges();
      expect(component.value as any).toEqual(5);
    });

    it('should return the upper limit on any tick that sets the value to be above max', () => {
      buttonUpElement = elementFromFixture(fixture, '.b-icon-chevron-up');
      emitNativeEvent(buttonUpElement);
      expect(component.value as any).toEqual(5);
      emitNativeEvent(buttonUpElement);
      expect(component.value as any).toEqual(6);
    });
  });

  describe('Ticker buttons', () => {
    it('should render ticker buttons if the inputType is number and step greater than 0', () => {
      component.inputType = InputTypes.number;
      component.step = 5;
      fixture.detectChanges();
      expect(elementFromFixture(fixture, '.bfe-buttons-wrap')).toBeTruthy();
    });
    it('should not render if step is not greater than 0', () => {
      component.inputType = InputTypes.number;
      component.step = 0;
      fixture.detectChanges();
      expect(elementFromFixture(fixture, '.bfe-buttons-wrap')).toBeFalsy();
    });
    it('should not render if input type is not number', () => {
      component.inputType = InputTypes.text;
      component.step = 5;
      fixture.detectChanges();
      expect(elementFromFixture(fixture, '.bfe-buttons-wrap')).toBeFalsy();
    });
  });

  describe('Number format', () => {
    beforeEach(() => {
      component.inputType = InputTypes.number;
      inputElement = component.input.nativeElement;
    });
    it('should not format number with commas, if numberFormat is not set', () => {
      fixture.detectChanges();
      component.writeValue(123456.78);
      expect(inputElement.value).toEqual('123456.78');
    });

    it('should format number with commas, if numberFormat is true', () => {
      component.numberFormat = true;
      fixture.detectChanges();
      component.writeValue(123456.78);
      expect(inputElement.value).toEqual('123,456.78');
    });

    it('should not format number with commas, if numberFormat is not set', () => {
      fixture.detectChanges();
      inputValue(inputElement, '123456.78', false);
      expect(inputElement.value).toEqual('123456.78');
    });

    it('should format number with commas, if numberFormat is true', () => {
      component.numberFormat = true;
      fixture.detectChanges();
      inputValue(inputElement, '123456.78', false);
      expect(inputElement.value).toEqual('123,456.78');
    });
  });

  describe('onlyIntegers', () => {
    beforeEach(() => {
      component.inputType = InputTypes.number;
      inputElement = component.input.nativeElement;
    });

    it('should round number, if onlyIntegers is true', () => {
      component.onlyIntegers = true;
      fixture.detectChanges();
      component.writeValue(123.56);
      expect(inputElement.value).toEqual('124');
    });

    it('should round number, if onlyIntegers is true', () => {
      component.onlyIntegers = true;
      fixture.detectChanges();
      inputValue(inputElement, '123.56', false);
      expect(inputElement.value).toEqual('124');
    });

    it('should not round number, if onlyIntegers is not set', () => {
      fixture.detectChanges();
      inputValue(inputElement, '123.56', false);
      expect(inputElement.value).toEqual('123.56');
    });
  });
});

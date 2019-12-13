import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';
import { InputEventType } from '../form-elements.enum';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InputMessageModule } from '../input-message/input-message.module';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { InputTypes } from './input.enum';
import { inputValue, emitNativeEvent } from '../../services/utils/test-helpers';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { Keys, NativeEvents } from '../../enums';
import { FormElementLabelModule } from '../form-element-label/form-element-label.module';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let inputElement: any;

  beforeEach(async(() => {
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

    it('should emit InputEvent on keyup, if there is a subscriber to the event; Should not propagateChange.', () => {
      component.value = 'change input value';
      emitNativeEvent(inputElement, NativeEvents.keyup, {
        key: Keys.enter,
      });
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onKey,
        value: 'change input value',
        key: Keys.enter,
      });
      expect(component.propagateChange).not.toHaveBeenCalled();
    });

    it('should NOT emit InputEvent on keyup, if there are no subscribers to the event', () => {
      component.changed.complete();
      emitNativeEvent(inputElement, NativeEvents.keyup, {
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
});

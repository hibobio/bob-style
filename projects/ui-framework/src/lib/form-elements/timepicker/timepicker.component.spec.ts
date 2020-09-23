import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimePickerComponent } from './timepicker.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InputMessageModule } from '../input-message/input-message.module';
import { DateParseService } from '../date-picker/date-parse-service/date-parse.service';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import {
  elementFromFixture,
  getPseudoContent,
  simpleChange,
  inputValue,
} from '../../services/utils/test-helpers';
import { IconsModule } from '../../icons/icons.module';
import { MockComponent } from 'ng-mocks';
import { FormElementLabelComponent } from '../form-element-label/form-element-label.component';
import { By } from '@angular/platform-browser';

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;
  let componentElem: HTMLElement;
  let labelElem: HTMLElement;
  let labelComp: FormElementLabelComponent;
  let hhInputElem: HTMLInputElement;
  let mmInputElem: HTMLInputElement;
  let iconElem: HTMLElement;
  let messageElem: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimePickerComponent,
        MockComponent(FormElementLabelComponent),
      ],
      imports: [NoopAnimationsModule, InputMessageModule, IconsModule],
      providers: [
        DateParseService,
        FormElementKeyboardCntrlService,
        EventManagerPlugins[0],
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TimePickerComponent);
        component = fixture.componentInstance;
        componentElem = fixture.nativeElement;

        component.ignoreEvents = [];
        component.label = 'Label';
        component.hintMessage = 'Hint';
        component.required = true;

        fixture.detectChanges();

        labelElem = elementFromFixture(fixture, '.bfe-label');
        labelComp = fixture.debugElement.query(By.css('.bfe-label'))
          .componentInstance;
        hhInputElem = elementFromFixture(
          fixture,
          '.bfe-input-hours'
        ) as HTMLInputElement;
        mmInputElem = elementFromFixture(
          fixture,
          '.bfe-input-minutes'
        ) as HTMLInputElement;
        messageElem = elementFromFixture(fixture, '[b-input-message]');

        spyOn(component.changed, 'emit');
        component.changed.subscribe(() => {});
        spyOn(component, 'propagateChange');
      });
  }));

  afterEach(() => {
    component.changed.complete();
  });

  describe('Init & Basic inputs', () => {
    it('should display label', () => {
      expect(labelComp.label).toEqual('Label');
      expect(getPseudoContent(labelElem, 'after')).toContain('*');
    });

    it('should display hint message', () => {
      expect(messageElem.innerText).toContain('Hint');
    });

    it('should display time icon', () => {
      iconElem = elementFromFixture(fixture, '.input-icon .b-icon');
      expect(iconElem).toBeTruthy();
      expect(iconElem.classList).toContain('b-icon-watch');
    });

    it('should not display clear icon, when component has no value', () => {
      iconElem = elementFromFixture(fixture, '.bfe-suffix');
      expect(iconElem.hidden).toBeTruthy();
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

  describe('Value input', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          value: '6:5',
        })
      );
      fixture.detectChanges();
    });

    it('should correctly parse value', () => {
      expect(component.valueHours).toEqual('06');
      expect(component.valueMinutes).toEqual('05');
      expect(component.value).toEqual('06:05');
    });

    it('should emit changed event', () => {
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: 'onWrite',
        value: '06:05',
      });
      expect(component.propagateChange).toHaveBeenCalledWith('06:05');
    });
  });

  describe('Keyboard input', () => {
    beforeEach(() => {
      inputValue(hhInputElem, '7');
      inputValue(mmInputElem, '8');
      fixture.detectChanges();
    });

    it('should correctly parse value', () => {
      expect(component.valueHours).toEqual('07');
      expect(component.valueMinutes).toEqual('08');
      expect(component.value).toEqual('07:08');
    });

    it('should emit changed event', () => {
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: 'onBlur',
        value: '07:08',
      });
      expect(component.propagateChange).toHaveBeenCalledWith('07:08');
    });
  });

  describe('Value parsing', () => {
    it('should not allow hours more than 23', () => {
      inputValue(hhInputElem, '33');
      fixture.detectChanges();
      expect(component.valueHours).toEqual('23');
    });

    it('should not allow minutes more than 59', () => {
      component.ngOnChanges(
        simpleChange({
          value: '6:133',
        })
      );
      fixture.detectChanges();
      expect(component.valueMinutes).toEqual('59');
    });

    it('should assume 00 hours if only minutes entered', () => {
      inputValue(mmInputElem, '33');
      fixture.detectChanges();

      expect(component.value).toEqual('00:33');
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: 'onBlur',
        value: '00:33',
      });
    });

    it('should assume 00 minutes if only hours entered', () => {
      inputValue(hhInputElem, '15');
      fixture.detectChanges();

      expect(component.value).toEqual('15:00');
      expect(component.propagateChange).toHaveBeenCalledWith('15:00');
    });
  });

  describe('Clear button', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          value: '15:30',
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
      fixture.detectChanges();

      expect(component.value).toBeNull();
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: 'onChange',
        value: null,
      });
      expect(component.propagateChange).toHaveBeenCalledWith(null);
    });
  });
});

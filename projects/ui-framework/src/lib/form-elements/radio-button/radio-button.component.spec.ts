import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioButtonComponent } from './radio-button.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { RadioDirection } from './radio-button.enum';
import { RadioConfig } from './radio-button.interface';
import { InputMessageModule } from '../input-message/input-message.module';

describe('RadioButtonComponent', () => {
  let component: RadioButtonComponent;
  let fixture: ComponentFixture<RadioButtonComponent>;
  let radioConfigMock: RadioConfig[];

  beforeEach(async(() => {
    radioConfigMock = [
      { id: 11, label: 'option one' },
      { id: 12, label: 'option two' },
      { id: 13, label: 'option three' }
    ];
    TestBed.configureTestingModule({
      declarations: [RadioButtonComponent],
      imports: [NoopAnimationsModule, CommonModule, InputMessageModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RadioButtonComponent);
        component = fixture.componentInstance;
        component.includeOptionInEvent = false;
        component.ngOnChanges({
          options: new SimpleChange(null, radioConfigMock, true)
        });
        spyOn(component.changed, 'emit');
        spyOn(component, 'propagateChange');
        fixture.detectChanges();
      });
  }));

  describe('init', () => {
    it('should render three options', () => {
      const radioButtons = fixture.debugElement.queryAll(By.css('.brd-input'));
      expect(radioButtons.length).toEqual(3);
    });
  });

  describe('option click', () => {
    it('should set selected option to be checked and emit changed event with id', () => {
      const radioButtonLabel = fixture.debugElement.queryAll(
        By.css('.brd-label')
      )[2];
      radioButtonLabel.nativeElement.click();
      fixture.detectChanges();
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: 'blur',
        value: 13
      });
    });
    it('should invoke propagateChange', () => {
      const radioButtonLabel = fixture.debugElement.queryAll(
        By.css('.brd-label')
      )[2];
      radioButtonLabel.nativeElement.click();
      fixture.detectChanges();
      expect(component.propagateChange).toHaveBeenCalledWith(13);
    });
  });

  describe('direction', () => {
    it('should set direction class with row by default', () => {
      const matRadioGroup = fixture.debugElement.query(By.css('.bfe-wrap'));
      expect(matRadioGroup.nativeElement.classList).toContain('direction-row');
    });
    it('should set direction class with column by attr', () => {
      component.direction = RadioDirection.column;
      fixture.detectChanges();
      const matRadioGroup = fixture.debugElement.query(By.css('.bfe-wrap'));
      expect(matRadioGroup.nativeElement.classList).toContain(
        'direction-column'
      );
    });
  });

  describe('OnChanges', () => {
    it('should mark selected radio option with the matching value', () => {
      const changes: SimpleChanges = {
        value: {
          previousValue: undefined,
          currentValue: 12,
          firstChange: true,
          isFirstChange: () => true
        }
      };
      component.ngOnChanges(changes);
      fixture.detectChanges();
      const radioButtons = fixture.debugElement.queryAll(By.css('.brd-input'));
      expect(radioButtons.length).toEqual(3);
      for (let i = 0; i < radioButtons.length; i++) {
        if (i === 1) {
          expect(radioButtons[i].nativeElement.checked).toBe(true);
        } else {
          expect(radioButtons[i].nativeElement.checked).toBe(false);
        }
      }
    });
    it('should emit change from value change', () => {
      const changes: SimpleChanges = {
        value: {
          previousValue: undefined,
          currentValue: 12,
          firstChange: true,
          isFirstChange: () => true
        }
      };
      component.ngOnChanges(changes);
      fixture.detectChanges();
      expect(component.changed.emit).toHaveBeenCalled();
    });
  });
});

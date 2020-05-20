import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxComponent } from './checkbox.component';
import { InputMessageModule } from '../input-message/input-message.module';
import { InputEventType } from '../form-elements.enum';
import { IconsModule } from 'bob-style';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let checkboxLabel: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        InputMessageModule,
        IconsModule,
        MatTooltipModule
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CheckboxComponent);
        component = fixture.componentInstance;
        component.wrapEvent = true;
        spyOn(component.changed, 'emit');
        component.changed.subscribe(() => {
        });
        fixture.detectChanges();
        checkboxLabel = fixture.debugElement.query(By.css('.bchk-label'))
          .nativeElement;
      });
  }));

  afterEach(() => {
    component.changed.complete();
  });

  describe('check / uncheck', () => {
    it('should turn checkbox on and trigger changed event with true', () => {
      component.value = false;
      fixture.detectChanges();
      checkboxLabel.click();
      fixture.detectChanges();
      expect(component.value).toBe(true);
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: true,
        indeterminate: false
      });
      const checkboxEl = fixture.debugElement.query(
        By.css('.bchk-input:checked')
      );
      expect(checkboxEl).toBeTruthy();
    });
    it('should turn checkbox off and trigger changed event with false', () => {
      component.value = true;
      fixture.detectChanges();
      checkboxLabel.click();
      fixture.detectChanges();
      expect(component.value).toBe(false);
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: false,
        indeterminate: false
      });
      const checkboxEl = fixture.debugElement.query(
        By.css('.bchk-input:checked')
      );
      expect(checkboxEl).toBeFalsy();
    });
  });
});

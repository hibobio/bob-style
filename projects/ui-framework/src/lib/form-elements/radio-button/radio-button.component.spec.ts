import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioButtonComponent, RadioDirection } from './radio-button.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatRadioGroup } from '@angular/material';

fdescribe('RadioButtonComponent', () => {
  let component: RadioButtonComponent;
  let fixture: ComponentFixture<RadioButtonComponent>;

  const radioConfigMock = [
    { id: 11, label: 'option one' },
    { id: 12, label: 'option two' },
    { id: 13, label: 'option three' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RadioButtonComponent],
      providers: [
        MatRadioGroup,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RadioButtonComponent);
        component = fixture.componentInstance;
        component.radioConfig = radioConfigMock;
        fixture.detectChanges();
      });
  });

  describe('direction', () => {
    it('should set direction class with row by default', () => {
      const matRadioGroup = fixture.debugElement.query(By.css('mat-radio-group'));
      expect(matRadioGroup.nativeElement.classList).toContain('direction-row');
    });
    it('should set direction class with column by attr', () => {
      component.direction = RadioDirection.column;
      fixture.detectChanges();
      const matRadioGroup = fixture.debugElement.query(By.css('mat-radio-group'));
      expect(matRadioGroup.nativeElement.classList).toContain('direction-column');
    });
  });

  describe('OnChanges', () => {
    it('should mark selected radio option with the matching value', () => {

    });
  });
});

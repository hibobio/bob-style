import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RadioButtonComponent, RadioDirection} from './radio-button.component';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {MatRadioGroup} from '@angular/material';


fdescribe('RadioButtonComponent', () => {
  let component: RadioButtonComponent;
  let fixture: ComponentFixture<RadioButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RadioButtonComponent],
      providers: [
        MatRadioGroup,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  describe('xxx', () => {
    it('should create component', () => {
      expect(component).toBeDefined();
    });
  });
  describe('template', () => {
    it('should call mat-radio-group with disable', () => {
      component.radioDirection = RadioDirection.column;
      fixture.detectChanges();
      const matRadioGroup: DebugElement = <DebugElement>fixture.debugElement.query(By.css('mat-radio-group'));
      expect(matRadioGroup.nativeElement.classList).toContain('direction-column');
    });
  });
});

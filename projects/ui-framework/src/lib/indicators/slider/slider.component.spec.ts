import { SliderComponent } from './slider.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { By } from '@angular/platform-browser';

describe('SliderModule', () => {
  let fixture: ComponentFixture<SliderComponent>;
  let component: SliderComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SliderComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    spyOn(component.progressChange, 'emit');
    fixture.detectChanges();
  });

  describe('onProgressChange', () => {
    it('Should emit the change event', () => {
      const e: MatSliderChange = {
        source: null,
        value: 10
      };
      component.onProgressChange(e);
      expect(component.progressChange.emit).toHaveBeenCalledWith(e);
    });
    it('should add class bar-full when bar is full', () => {
      component.max = 10;
      const e: MatSliderChange = {
        source: null,
        value: 10
      };
      component.onProgressChange(e);
      fixture.detectChanges();
      const progressEl = fixture.debugElement.query(By.css('.slider-progress'));
      expect(progressEl.classes['bar-full']).toBeTruthy();
    });
  });

  describe('readOnly', () => {
    it('Should set read only', () => {
      component.readOnly = true;
      fixture.detectChanges();

      const progressEl = fixture.debugElement.query(By.css('.slider-progress'));
      expect(progressEl.classes['read-only']).toBeTruthy();
    });
    it('Should unset read only', () => {
      component.readOnly = false;
      fixture.detectChanges();

      const progressEl = fixture.debugElement.query(By.css('.slider-progress'));
      expect(progressEl.classes['read-only']).toBeFalsy();
    });
  });

  describe('disabled', () => {
    it('Should set disabled', () => {
      component.showLabel = true;
      component.disabled = true;
      fixture.detectChanges();

      const progressEl = fixture.debugElement.query(By.css('.slider-progress'));
      const labelEl = fixture.debugElement.query(By.css('.slider-label'));

      expect(progressEl.classes['disabled']).toBeTruthy();
      expect(labelEl.classes['disabled']).toBeTruthy();
    });
    it('Should unset disabled', () => {
      component.showLabel = true;
      component.disabled = false;
      fixture.detectChanges();

      const progressEl = fixture.debugElement.query(By.css('.slider-progress'));
      const labelEl = fixture.debugElement.query(By.css('.slider-label'));

      expect(progressEl.classes['disabled']).toBeFalsy();
      expect(labelEl.classes['disabled']).toBeFalsy();
    });
  });

  describe('label', () => {
    it('Should hide label', () => {
      component.showLabel = false;
      fixture.detectChanges();

      const labelEl = fixture.debugElement.query(By.css('.slider-label'));
      expect(labelEl).toBeNull();
    });
    it('Should set symbol value and symbol', () => {
      component.showLabel = true;
      component.value = 10;
      component.labelSymbol = '$';
      fixture.detectChanges();

      const labelEl = fixture.debugElement.query(By.css('.slider-label'));
      expect(labelEl.nativeElement.innerText).toEqual('10$');
    });
  });
});

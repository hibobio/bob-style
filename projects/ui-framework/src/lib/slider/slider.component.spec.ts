import { SliderComponent } from './slider.component';
import {
  ComponentFixture,
  async,
  TestBed
} from '@angular/core/testing';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import { MatSliderChange } from '@angular/material';
import {By} from '@angular/platform-browser';

describe('SliderModule', () => {
  let fixture: ComponentFixture<SliderComponent>;
  let component: SliderComponent;

  beforeEach(async(() => {
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
        value: 10,
      };
      component.onProgressChange(e);
      expect(component.progressChange.emit).toHaveBeenCalledWith(e);
    });
  });

  describe('readOnly', () => {
    it('Should set read only', () => {
      component.readOnly = true;
      fixture.detectChanges();
      const debugElement: DebugElement = fixture.debugElement;
      const sliderWrapper = debugElement.query(By.css('.slider-wrapper'));
      expect(sliderWrapper.classes['read-only']).toBeTruthy();
    });
    it('Should unset read only', () => {
      component.readOnly = false;
      fixture.detectChanges();
      const debugElement: DebugElement = fixture.debugElement;
      const sliderWrapper = debugElement.query(By.css('.slider-wrapper'));
      expect(sliderWrapper.classes['read-only']).toBeFalsy();
    });
  });

  describe('label', () => {
    it('Should set label to disabled', () => {
      component.disabled = true;
      component.showLabel = true;
      fixture.detectChanges();
      const debugElement: DebugElement = fixture.debugElement;
      const sliderLabel = debugElement.query(By.css('.slider-label'));
      expect(sliderLabel.classes['disabled']).toBeTruthy();
    });
    it('Should set label to enabled', () => {
      component.disabled = false;
      component.showLabel = true;
      fixture.detectChanges();
      const debugElement: DebugElement = fixture.debugElement;
      const sliderLabel = debugElement.query(By.css('.slider-label'));
      expect(sliderLabel.classes['disabled']).toBeFalsy();
    });
    it('Should hide label', () => {
      component.showLabel = false;
      fixture.detectChanges();
      const debugElement: DebugElement = fixture.debugElement;
      const sliderLabel = debugElement.query(By.css('.slider-label'));
      expect(sliderLabel).toBeNull();
    });
    it('Should set symbol value and symbol', () => {
      component.showLabel = true;
      component.value = 10;
      component.labelSymbol = '$';
      fixture.detectChanges();
      const debugElement: DebugElement = fixture.debugElement;
      const sliderLabel = debugElement.query(By.css('.slider-label'));
      expect(sliderLabel.nativeElement['innerHTML']).toEqual('10$');
    });
  });
});

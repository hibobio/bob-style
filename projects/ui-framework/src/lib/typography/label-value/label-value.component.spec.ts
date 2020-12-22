import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { LabelValueComponent } from './label-value.component';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

describe('LabelValueComponent', () => {
  let component: LabelValueComponent;
  let fixture: ComponentFixture<LabelValueComponent>;
  let element: HTMLElement;
  let labelElement: HTMLElement;
  let valueElement: HTMLElement;
  let iconElement: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LabelValueComponent],
      providers: [EventManagerPlugins[0]],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(LabelValueComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LabelValueComponent);
        component = fixture.componentInstance;
        component.label = 'Label';
        component.value = 'Value';
        fixture.detectChanges();
        element = fixture.debugElement.nativeElement;
        labelElement = fixture.debugElement.query(By.css('.blv-label'))
          .nativeElement;
        valueElement = fixture.debugElement.query(By.css('.blv-value'))
          .nativeElement;
        iconElement = fixture.debugElement.query(By.css('.blv-icon'))
          ? fixture.debugElement.query(By.css('.blv-icon')).nativeElement
          : null;
      });
  }));

  beforeEach(() => {});

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

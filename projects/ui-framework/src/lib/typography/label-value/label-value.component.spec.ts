/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DebugElement,
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA
} from '@angular/core';

import { LabelValueComponent } from './label-value.component';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

describe('LabelValueComponent', () => {
  let component: LabelValueComponent;
  let fixture: ComponentFixture<LabelValueComponent>;
  let element: HTMLElement;
  let labelElement: HTMLElement;
  let valueElement: HTMLElement;
  let iconElement: HTMLElement;

  beforeEach(async(() => {
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
          .nativeElement;
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

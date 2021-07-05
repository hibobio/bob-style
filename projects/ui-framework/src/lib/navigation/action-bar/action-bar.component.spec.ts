import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ActionBarComponent } from './action-bar.component';

describe('ActionBarComponent', () => {
  let component: ActionBarComponent;
  let fixture: ComponentFixture<ActionBarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ActionBarComponent],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ActionBarComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    })
  );

  describe('template', () => {
    let labelElement: DebugElement;
    it('should populate label div with the supplied label', () => {
      component.label = 'test';
      fixture.detectChanges();
      labelElement = fixture.debugElement.query(By.css('.label'));
      expect(labelElement.nativeElement.textContent).toEqual('test');
    });
    it('should hide label when showLabel is false', () => {
      component.label = 'test';
      component.showLabel = false;
      fixture.detectChanges();
      labelElement = fixture.debugElement.query(By.css('.label'));
      expect(labelElement.nativeElement.hidden).toBeTruthy();
    });
  });
});

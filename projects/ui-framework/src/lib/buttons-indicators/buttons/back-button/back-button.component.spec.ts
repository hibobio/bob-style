import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BackButtonComponent } from './back-button.component';

import { BackButtonType } from '../buttons.enum';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackButtonComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(BackButtonComponent);
      component = fixture.componentInstance;
      spyOn(component.clicked, 'emit');
      fixture.detectChanges();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

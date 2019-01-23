import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareButtonComponent } from './square.component';
import { ButtonType } from '../buttons.enum';

describe('ButtonComponent', () => {
  let component: SquareButtonComponent;
  let fixture: ComponentFixture<SquareButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquareButtonComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(SquareButtonComponent);
      component = fixture.componentInstance;
      spyOn(component.clicked, 'emit');
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClick', () => {
    it('Should emit the click event', () => {
      const e = {
        id: 1
      };
      component.onClick(e);
      expect(component.clicked.emit).toHaveBeenCalledWith(e);
    });
  });
});

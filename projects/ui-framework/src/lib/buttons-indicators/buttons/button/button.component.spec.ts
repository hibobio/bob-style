import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { ButtonType, ButtonSize } from '../buttons.enum';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(ButtonComponent);
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

  describe('getClassNames', () => {
    it('Should return both type and size', () => {
      component.type = ButtonType.primary;
      component.size = ButtonSize.large;
      const result = component.getClassNames();
      expect(result).toEqual('primary large');
    });
  });
});

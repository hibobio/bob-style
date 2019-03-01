import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { ButtonType, ButtonSize } from '../buttons.enum';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ButtonComponent,
      ],
      imports: [
        MatButtonModule,
      ],
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

  describe('button class names', () => {
    it('Should have both type and size', () => {
      component.type = ButtonType.primary;
      component.size = ButtonSize.large;
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement.nativeElement.classList).toContain('primary');
      expect(buttonElement.nativeElement.classList).toContain('large');
    });
    it('should not have disabled class by default', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement.nativeElement.classList).not.toContain('disabled');
    });
    it('should have disabled class', () => {
      component.disabled = true;
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement.nativeElement.classList).toContain('disabled');
    });
  });
});

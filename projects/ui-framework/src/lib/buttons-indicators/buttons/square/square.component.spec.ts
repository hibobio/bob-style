import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareButtonComponent } from './square.component';
import { MatButtonModule } from '@angular/material';
import { IconsModule } from '../../../icons/icons.module';
import { IconService } from '../../../icons/icon.service';
import { ButtonType } from '../buttons.enum';
import { By } from '@angular/platform-browser';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('ButtonComponent', () => {
  let component: SquareButtonComponent;
  let fixture: ComponentFixture<SquareButtonComponent>;
  let spyIconService: SpyObj<IconService>;

  beforeEach(async(() => {
    spyIconService = createSpyObj('spyIconService', ['initIcon']);

    TestBed.configureTestingModule({
      declarations: [
        SquareButtonComponent,
      ],
      providers: [
        { provide: IconService, useValue: spyIconService }
      ],
      imports: [
        MatButtonModule,
        IconsModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SquareButtonComponent);
        component = fixture.componentInstance;
        spyOn(component.clicked, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('onClick', () => {
    it('Should emit the click event', () => {
      const e = {
        id: 1
      };
      component.onClick(e);
      expect(component.clicked.emit).toHaveBeenCalledWith(e);
    });
  });

  describe('button classes', () => {
    it('should have type as class', () => {
      component.type = ButtonType.tertiary;
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement.nativeElement.classList).toContain('tertiary');
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

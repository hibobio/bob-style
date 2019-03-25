import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material';
import { IconsModule } from '../../../icons/icons.module';
import { IconService } from '../../../icons/icon.service';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let spyIconService: SpyObj<IconService>;

  beforeEach(async(() => {
    spyIconService = createSpyObj('spyIconService', ['initIcon']);

    TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      providers: [{ provide: IconService, useValue: spyIconService }],
      imports: [MatButtonModule, IconsModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ButtonComponent);
        component = fixture.componentInstance;
        spyOn(component.clicked, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('onClick', () => {
    it('Should emit the click event', () => {
      const e = {
        id: 1,
        stopPropagation: () => true
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

  describe('has-icon', () => {
    it('should not add icon if no icon is passed', () => {
      const iconElement = fixture.debugElement.query(By.css('b-icon'));
      expect(iconElement).toBeFalsy();
    });
    it('should add icon if icon is passed', () => {
      component.icon = Icons.timeline;
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(By.css('b-icon'));
      expect(iconElement).toBeTruthy();
    });
    it('should add has-icon class to button', () => {
      component.icon = Icons.timeline;
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement.nativeElement.classList).toContain('has-icon');
    });
  });

  describe('OnChanges', () => {
    const testColor = (
      buttonType: ButtonType,
      expectedColor: IconColor
    ): void => {
      component.type = buttonType;
      component.icon = Icons.timeline;
      component.ngOnChanges();
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(By.css('b-icon'));
      expect(iconElement.componentInstance.color).toEqual(expectedColor);
    };
    const testSize = (buttonSize: ButtonSize, expectedSize: IconSize): void => {
      component.size = buttonSize;
      component.icon = Icons.timeline;
      component.ngOnChanges();
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(By.css('b-icon'));
      expect(iconElement.componentInstance.size).toEqual(expectedSize);
    };
    it('should not set iconColor or iconSize if there is no icon', () => {
      component.ngOnChanges();
      expect(component.iconColor).toBeFalsy();
      expect(component.iconSize).toBeFalsy();
    });
    it('should set iconColor based on button type', () => {
      testColor(ButtonType.primary, IconColor.white);
      testColor(ButtonType.secondary, IconColor.dark);
      testColor(ButtonType.tertiary, IconColor.dark);
    });
    it('should set iconColor based on disabled', () => {
      component.disabled = true;
      testColor(ButtonType.primary, IconColor.white);
      testColor(ButtonType.secondary, IconColor.light);
      testColor(ButtonType.tertiary, IconColor.light);
    });
    it('should set iconSize based on button size', () => {
      testSize(ButtonSize.small, IconSize.medium);
      testSize(ButtonSize.medium, IconSize.medium);
      testSize(ButtonSize.large, IconSize.large);
    });
  });
});

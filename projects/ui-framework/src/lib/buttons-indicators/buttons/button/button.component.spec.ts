import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { IconsModule } from '../../../icons/icons.module';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let buttonElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      providers: [],
      imports: [MatButtonModule, IconsModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ButtonComponent);
        component = fixture.componentInstance;
        buttonElement = fixture.debugElement.query(By.css('button'))
          .nativeElement;
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
      expect(buttonElement.classList).toContain('primary');
      expect(buttonElement.classList).toContain('large');
    });
    it('should not have disabled class by default', () => {
      expect(buttonElement.classList).not.toContain('disabled');
    });
    it('should have disabled class', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('disabled');
    });
  });

  describe('icon', () => {
    it('should not add icon if no icon is passed', () => {
      expect(buttonElement.className).not.toContain('b-icon');
    });
    it('should add icon if icon is passed', () => {
      component.icon = Icons.timeline;
      fixture.detectChanges();
      expect(buttonElement.className).toContain('b-icon');
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
      expect(buttonElement.className).toContain('b-icon-' + expectedColor);
    };
    const testSize = (buttonSize: ButtonSize, expectedSize: IconSize): void => {
      component.size = buttonSize;
      component.icon = Icons.timeline;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(buttonElement.className).toContain('b-icon-' + expectedSize);
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

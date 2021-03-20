import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';

import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { simpleChange } from '../../services/utils/functional-utils';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let buttonElement: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ButtonComponent],
        providers: [],
        imports: [MatButtonModule, IconsModule],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ButtonComponent);
          component = fixture.componentInstance;
          buttonElement = component.button.nativeElement;

          spyOn(component.clicked, 'emit');
          fixture.detectChanges();
        });
    })
  );

  describe('onClick', () => {
    it('Should emit the click event', () => {
      buttonElement.click();
      expect(component.clicked.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('button class names', () => {
    it('Should have both type and size', () => {
      component.ngOnChanges(
        simpleChange({
          type: ButtonType.primary,
          size: ButtonSize.large,
        })
      );

      expect(component.buttonClass).toContain('primary');
      expect(component.buttonClass).toContain('large');
      expect(buttonElement.classList).toContain('primary');
      expect(buttonElement.classList).toContain('large');
    });
    it('should not have disabled attribute by default', () => {
      expect(buttonElement.getAttribute('disabled')).toBeFalsy();
    });
    it('should have disabled attribute', () => {
      component.ngOnChanges(
        simpleChange({
          disabled: true,
        })
      );

      expect(buttonElement.getAttribute('disabled')).toBeTruthy();
    });
  });

  describe('icon', () => {
    it('should not add icon if no icon is passed', () => {
      expect(buttonElement.dataset.iconBefore).toBeFalsy();
    });
    it('should add icon if icon is passed', () => {
      component.ngOnChanges(
        simpleChange({
          icon: Icons.timeline,
        })
      );
      expect(buttonElement.dataset.iconBefore).toBeTruthy();
    });
  });

  describe('OnChanges', () => {
    const testColor = (buttonType: ButtonType, expectedColor: IconColor): void => {
      component.ngOnChanges(
        simpleChange({
          type: buttonType,
          icon: Icons.timeline,
        })
      );

      expect(buttonElement.dataset.iconBeforeColor).toEqual(expectedColor);
    };

    const testSize = (buttonSize: ButtonSize, expectedSize: IconSize): void => {
      component.ngOnChanges(
        simpleChange({
          size: buttonSize,
          icon: Icons.timeline,
        })
      );

      expect(buttonElement.dataset.iconBeforeSize).toEqual(expectedSize);
    };

    it('should not set iconColor or iconSize if there is no icon', () => {
      expect(buttonElement.dataset.iconBeforeColor).toBeFalsy();
      expect(buttonElement.dataset.iconBeforeSize).toBeFalsy();
    });

    it('should set iconColor based on button type', () => {
      testColor(ButtonType.primary, IconColor.white);
      testColor(ButtonType.secondary, IconColor.dark);
      testColor(ButtonType.tertiary, IconColor.dark);
    });

    it('should set iconSize based on button size', () => {
      testSize(ButtonSize.small, IconSize.medium);
      testSize(ButtonSize.medium, IconSize.medium);
      testSize(ButtonSize.large, IconSize.large);
    });
  });
});

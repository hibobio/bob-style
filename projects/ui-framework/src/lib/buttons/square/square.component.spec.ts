import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';

import { IconComponent } from '../../icons/icon.component';
import { Icons, IconSize } from '../../icons/icons.enum';
import { simpleChange } from '../../services/utils/functional-utils';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { SquareButtonComponent } from './square.component';

describe('SquareButtonComponent', () => {
  let component: SquareButtonComponent;
  let fixture: ComponentFixture<SquareButtonComponent>;
  let buttonElement: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SquareButtonComponent, MockComponent(IconComponent)],
        imports: [MatButtonModule],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(SquareButtonComponent);
          component = fixture.componentInstance;

          component.ngOnChanges(
            simpleChange({
              icon: Icons.file_copy,
            })
          );

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

  describe('OnChanges', () => {
    it('should set icon size to large by default', () => {
      expect(buttonElement.dataset.iconBeforeSize).toEqual(IconSize.large);
    });

    it('should set icon size to medium if size is small', () => {
      fixture.detectChanges();
      component.ngOnChanges(
        simpleChange({
          size: ButtonSize.small,
        })
      );

      expect(buttonElement.dataset.iconBeforeSize).toEqual(IconSize.medium);
    });
  });

  describe('button classes', () => {
    it('should have type as class', () => {
      component.ngOnChanges(
        simpleChange({
          type: ButtonType.tertiary,
        })
      );
      expect(component.buttonClass).toContain('tertiary');
      expect(buttonElement.classList).toContain('tertiary');
    });
    it('should not have disabled class by default', () => {
      expect(buttonElement.getAttribute('disabled')).toBeFalsy();
    });
    it('should have disabled class', () => {
      component.ngOnChanges(
        simpleChange({
          disabled: true,
        })
      );
      expect(buttonElement.getAttribute('disabled')).toBeTruthy();
    });
  });
});

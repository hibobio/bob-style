import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IconComponent } from '../../icons/icon.component';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { LinkColor } from '../../indicators/link/link.enum';
import { simpleChange } from '../../services/utils/functional-utils';
import { TypographyModule } from '../../typography/typography.module';
import { TextButtonComponent } from './text-button.component';

describe('TextButtonComponent', () => {
  let component: TextButtonComponent;
  let fixture: ComponentFixture<TextButtonComponent>;
  let element: HTMLElement;
  let buttonElement: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MockComponent(IconComponent), TextButtonComponent],
        imports: [TypographyModule],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(TextButtonComponent);
          component = fixture.componentInstance;
          element = fixture.debugElement.nativeElement;

          buttonElement = component.button.nativeElement;

          spyOn(component.clicked, 'emit');
        });
    })
  );

  it('should display input text', () => {
    component.text = 'Button text';
    fixture.detectChanges();
    expect(element.innerText).toEqual('Button text');
  });

  it('should not display icon if no input is passed', () => {
    fixture.detectChanges();
    expect(component.buttonClass).not.toContain('b-icon');
    expect(buttonElement.dataset.iconBefore).toBeFalsy();
  });

  it('should display icon if is input', () => {
    component.ngOnChanges(
      simpleChange({
        icon: Icons.home,
      })
    );

    expect(component.buttonClass).toContain(IconColor.dark);
    expect(buttonElement.dataset.iconBefore).toBeTruthy();
    expect(buttonElement.dataset.iconBeforeSize).toEqual(IconSize.medium);
  });

  it('should set color to orange for component and icon', () => {
    component.ngOnChanges(
      simpleChange({
        icon: Icons.home,
        color: LinkColor.primary,
      })
    );

    expect(component.buttonClass).toContain('color-primary');
    expect(component.buttonClass).toContain('b-icon-' + IconColor.primary);
    expect(buttonElement.className).toContain('color-primary');
    expect(buttonElement.className).toContain('b-icon-' + IconColor.primary);
  });

  it('should emit clicked when clicking the span', () => {
    fixture.detectChanges();
    buttonElement.click();
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should add disabled class', () => {
    component.ngOnChanges(
      simpleChange({
        disabled: true,
      })
    );

    expect(component.buttonClass).toContain('disabled');
    expect(buttonElement.className).toContain('disabled');
  });
});

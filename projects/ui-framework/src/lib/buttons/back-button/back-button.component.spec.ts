import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Icons, IconSize } from '../../icons/icons.enum';
import { simpleChange } from '../../services/utils/functional-utils';
import { BackButtonType, ButtonSize } from '../buttons.enum';
import { BackButtonComponent } from './back-button.component';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;
  let buttonElement: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BackButtonComponent],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(BackButtonComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();

          buttonElement = component.button.nativeElement;
          spyOn(component.clicked, 'emit');
        });
    })
  );

  it('should show button component with back icon and button size small', () => {
    expect(component.buttonClass).toContain(ButtonSize.small);
    expect(buttonElement.classList).toContain(ButtonSize.small);

    expect(buttonElement.dataset.iconBefore).toContain(Icons.back_arrow_link.replace('b-icon-', ''));

    expect(buttonElement.dataset.iconBeforeSize).toContain(IconSize.medium);
  });

  it('should emit onclick', () => {
    buttonElement.click();
    expect(component.clicked.emit).toHaveBeenCalledTimes(1);
  });

  it('should not set button as disabled by default', () => {
    expect(buttonElement.getAttribute('disabled')).toBeFalsy();
  });

  it('should set button as disabled', () => {
    component.ngOnChanges(
      simpleChange({
        disabled: true,
      })
    );

    expect(buttonElement.getAttribute('disabled')).toBeTruthy();
  });

  it('should set button type as secondary by default', () => {
    expect(component.buttonClass).toContain(BackButtonType.secondary);
    expect(buttonElement.classList).toContain(BackButtonType.secondary);
  });

  it('should set button type as tertiary', () => {
    component.ngOnChanges(
      simpleChange({
        type: BackButtonType.tertiary,
      })
    );

    expect(component.buttonClass).toContain(BackButtonType.tertiary);
    expect(buttonElement.classList).toContain(BackButtonType.tertiary);
  });
});

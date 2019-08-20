import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BackButtonComponent } from './back-button.component';
import { ButtonComponent } from '../button/button.component';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { Icons } from '../../../icons/icons.enum';
import { BackButtonType, ButtonSize } from '../buttons.enum';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;
  let buttonElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(ButtonComponent), BackButtonComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BackButtonComponent);
        component = fixture.componentInstance;
        buttonElement = fixture.debugElement.query(By.css('button'))
          .nativeElement;
        spyOn(component.clicked, 'emit');
        fixture.detectChanges();
      });
  }));

  it('should show button component with back icon and button size small', () => {
    expect(buttonElement.classList).toContain(Icons.back_arrow_link);
    expect(buttonElement.classList).toContain(ButtonSize.small);
  });

  it('should emit onclick', () => {
    buttonElement.click();
    expect(component.clicked.emit).toHaveBeenCalledTimes(1);
  });

  it('should not set button as disabled by default', () => {
    expect(buttonElement.getAttribute('disabled')).toBeFalsy();
  });

  it('should set button as disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(buttonElement.getAttribute('disabled')).toBeTruthy();
  });

  it('should set button type as secondary by default', () => {
    expect(buttonElement.classList).toContain(BackButtonType.secondary);
  });

  it('should set button type as tertiary', () => {
    component.type = BackButtonType.tertiary as any;
    fixture.detectChanges();
    expect(buttonElement.classList).toContain(BackButtonType.tertiary);
  });
});

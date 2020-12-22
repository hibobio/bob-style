import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { AlertType } from '../alert.enum';
import { MockComponent } from 'ng-mocks';
import { IconComponent } from '../../../icons/icon.component';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ButtonsModule, TypographyModule, BrowserAnimationsModule],
      declarations: [AlertComponent, MockComponent(IconComponent)]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AlertComponent);
        component = fixture.componentInstance;
        component.alertConfig = {
          alertType: AlertType.success,
          text: 'text',
          title: 'title'
        };
        component.closeAlertCallback = Function;
        spyOn(component, 'closeAlertCallback');
        fixture.detectChanges();
      });
  }));

  it('should change animation state and call to alert callback when animation finish', () => {
    component.closeAlert();
    expect(component.animationState).toEqual('leave');
    component.onAnimationDone({toState: 'leave'});
    expect(component.closeAlertCallback).toHaveBeenCalled();
  });
});

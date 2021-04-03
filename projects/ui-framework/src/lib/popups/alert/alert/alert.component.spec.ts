import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonsModule } from '../../../buttons/buttons.module';
import { IconComponent } from '../../../icons/icon.component';
import { TypographyModule } from '../../../typography/typography.module';
import { AlertType } from '../alert.enum';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ButtonsModule, TypographyModule, BrowserAnimationsModule],
        declarations: [AlertComponent, MockComponent(IconComponent)],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AlertComponent);
          component = fixture.componentInstance;
          component.alertConfig = {
            alertType: AlertType.success,
            text: 'text',
            title: 'title',
          };
          component.closeAlertCallback = Function;
          spyOn(component, 'closeAlertCallback');
          fixture.detectChanges();
        });
    })
  );

  it('should change animation state and call to alert callback when animation finish', () => {
    component.closeAlert();
    expect(component.animationState).toEqual('leave');
    component.onAnimationDone({ toState: 'leave' } as any);
    expect(component.closeAlertCallback).toHaveBeenCalled();
  });
});

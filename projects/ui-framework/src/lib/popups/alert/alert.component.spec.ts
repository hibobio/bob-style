import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { AlertType } from './alert.enum';
import { MockComponent } from 'ng-mocks';
import { IconComponent } from '../../icons/icon.component';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ButtonsModule, TypographyModule],
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

  it('should call to close alert callback', () => {
    component.closeAlert();
    expect(component.closeAlertCallback).toHaveBeenCalled();
  });
});

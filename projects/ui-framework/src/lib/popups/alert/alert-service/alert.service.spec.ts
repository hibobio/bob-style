import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { AlertService } from './alert.service';
import { AlertConfig } from '../alert.interface';
import { AlertType } from '../alert.enum';
import { ComponentRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { Overlay, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { IconComponent } from '../../../icons/icon.component';
import { AlertComponent } from '../alert/alert.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from '../alert.module';

const ALERT_DURATION_TICK = 7001;
const ALERT_CONFIG: AlertConfig = {
  alertType: AlertType.success,
  text: 'text',
  title: 'title'
};

describe('AlertService', () => {
  let alertService: AlertService;
  let overlayElement: HTMLElement;
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        AlertModule,
      ],
      declarations: [
        MockComponent(IconComponent),
        MockComponent(AlertComponent),
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AlertService,
      ]
    });
    inject(
      [OverlayContainer, Overlay],
      (oc: OverlayContainer) => {
        overlayElement = oc.getContainerElement();
      }
    )();
    alertService = TestBed.get(AlertService);
  });

  describe('Alert Service', () => {
    it('should create the alert component and init its configuration', fakeAsync(() => {
      const alertComponentRef: ComponentRef<AlertComponent> = alertService.showAlert(ALERT_CONFIG);
      tick(ALERT_DURATION_TICK);
      expect(alertComponentRef.instance.alertConfig.title).toEqual(ALERT_CONFIG.title);
      expect(alertComponentRef.instance.alertConfig.text).toEqual(ALERT_CONFIG.text);
      expect(alertComponentRef.instance.alertConfig.alertType).toEqual(ALERT_CONFIG.alertType);
      expect(alertService.isOpen).toBeFalsy();
      alertComponentRef.instance.onAnimationDone({ toState: 'leave' });
    }));

    it('should dispose alert if one is open before opening a new one', () => {
      alertService.showAlert(ALERT_CONFIG);
      const spyAlert = alertService.overlayRef;
      spyOn(spyAlert, 'dispose');
      alertService.showAlert(ALERT_CONFIG);
      expect(spyAlert.dispose).toHaveBeenCalledTimes(1);
    });

    it('should start leave animation on button click and close alert', fakeAsync(() => {
      const alertComponentRef: ComponentRef<AlertComponent> = alertService.showAlert(ALERT_CONFIG);
      const closeButton = overlayElement.querySelector(
        'b-square-button button'
      ) as HTMLElement;
      closeButton.click();
      expect(alertComponentRef.instance.animationState).toEqual('leave');
      alertComponentRef.instance.onAnimationDone({ toState: 'leave' });
      expect(alertService.overlayRef.hostElement).toBeNull();
      expect(alertService.overlayRef.hasAttached()).toBeFalsy();
      expect(alertService.isOpen).toBeFalsy();
      tick(ALERT_DURATION_TICK);
    }));

    it('should close the alert after 7 seconds', fakeAsync(() => {
      const alertComponentRef: ComponentRef<AlertComponent> = alertService.showAlert(ALERT_CONFIG);
      tick(ALERT_DURATION_TICK);
      expect(alertComponentRef.instance.animationState).toEqual('leave');
      alertComponentRef.instance.onAnimationDone({ toState: 'leave' });
      expect(alertService.overlayRef.hostElement).toBeNull();
      expect(alertService.overlayRef.hasAttached()).toBeFalsy();
      expect(alertService.isOpen).toBeFalsy();
    }));
  });
});

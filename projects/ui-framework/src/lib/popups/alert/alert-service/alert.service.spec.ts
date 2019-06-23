import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { AlertService } from './alert.service';
import { AlertConfig } from '../alert.interface';
import { AlertType } from '../alert.enum';
import {
  ComponentFactoryResolver,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { AlertComponent } from '../alert.component';
import { MockComponent } from 'ng-mocks';
import { Overlay, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { ALERT_CONFIG_MOCK } from '../alert.mock';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../../icons/icons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { AlertModule } from '../alert.module';
import { IconSize } from '../../../icons/icons.enum';
import { IconComponent } from '../../../icons/icon.component';
import { IconService } from '../../../icons/icon.service';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

const ALERT_DURATION_TICK = 7001;

describe('AlertService', () => {
  let alertService: AlertService;
  let overlayElement: HTMLElement;
  let spyIconService: SpyObj<IconService>;

  beforeEach(() => {
    spyIconService = createSpyObj('spyIconService', ['initIcon']);

    TestBed.configureTestingModule({
      imports: [
        AlertModule,
        OverlayModule,
        ButtonsModule,
        TypographyModule,
        IconsModule
      ],
      declarations: [
        MockComponent(IconComponent),
        MockComponent(AlertComponent)
      ],
      providers: [
        AlertService,
        { provide: IconService, useValue: spyIconService }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    });
    inject(
      [OverlayContainer, ComponentFactoryResolver, Overlay],
      (oc: OverlayContainer) => {
        overlayElement = oc.getContainerElement();
      }
    )();
    alertService = TestBed.get(AlertService);
  });

  describe('Alert Service', () => {
    it('should inject the alert component with the right configuration', fakeAsync(() => {
      const alertConfig: AlertConfig = {
        alertType: AlertType.success,
        text: 'text',
        title: 'title'
      };
      alertService.showAlert(alertConfig);
      tick(ALERT_DURATION_TICK);
      expect(alertService.alertComponentRef.instance.alertConfig).toEqual(
        ALERT_CONFIG_MOCK
      );
    }));

    it('should check alert native elements', fakeAsync(() => {
      const alertConfig: AlertConfig = {
        alertType: AlertType.success,
        text: 'text',
        title: 'title'
      };
      alertService.showAlert(alertConfig);
      const titleElement = overlayElement.querySelector(
        'b-bold-body'
      ) as HTMLElement;
      const textElement = overlayElement.querySelector(
        '.content p'
      ) as HTMLElement;
      const iconElement = overlayElement.querySelector(
        '.icon mat-icon'
      ) as HTMLElement;
      expect(titleElement.innerText).toEqual('TITLE');
      expect(textElement.innerText).toEqual('text');
      expect(iconElement.classList.contains(IconSize.xLarge)).toBeTruthy();
      expect(alertService.isOpen).toBeTruthy();
      tick(ALERT_DURATION_TICK);
    }));

    it('should close alert on button click', fakeAsync(() => {
      const alertConfig: AlertConfig = {
        alertType: AlertType.success,
        text: 'text',
        title: 'title'
      };
      alertService.showAlert(alertConfig);
      const closeButton = overlayElement.querySelector(
        'b-square-button button'
      ) as HTMLElement;
      closeButton.click();
      tick(ALERT_DURATION_TICK);
      expect(alertService.overlayRef.hostElement).toBeNull();
      expect(alertService.overlayRef.hasAttached()).toBeFalsy();
      expect(alertService.isOpen).toBeFalsy();
    }));

    it('should close the alert after 7 seconds', fakeAsync(() => {
      const alertConfig: AlertConfig = {
        alertType: AlertType.success,
        text: 'text',
        title: 'title'
      };
      alertService.showAlert(alertConfig);
      tick(ALERT_DURATION_TICK);
      expect(alertService.overlayRef.hostElement).toBeNull();
      expect(alertService.overlayRef.hasAttached()).toBeFalsy();
      expect(alertService.isOpen).toBeFalsy();
    }));
  });
});

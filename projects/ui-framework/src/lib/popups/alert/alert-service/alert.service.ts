import { OperatorFunction, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ComponentRef, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  isObject,
  isString,
  objectGetDeepestValid,
  objectRemoveKey,
  stringify,
} from '../../../services/utils/functional-utils';
import { Timer } from '../../../types';
import { Panel } from '../../panel/panel.interface';
import { PanelService } from '../../panel/panel.service';
import { AlertType } from '../alert.enum';
import { AlertConfig } from '../alert.interface';
import { AlertComponent } from '../alert/alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    private overlay: Overlay,
    private panelService: PanelService,
    private translate: TranslateService
  ) {}

  public isOpen: boolean;
  private timeRef: Timer;
  private alertDuration = 7000;

  public panel: Panel<AlertComponent>;

  public get overlayRef(): OverlayRef {
    return this.panel?.overlayRef;
  }
  public get alertComponentRef(): ComponentRef<AlertComponent> {
    return this.panel?.componentRef;
  }

  public showAlert(config: AlertConfig): ComponentRef<AlertComponent> {
    this.closeAlertCallback();

    this.panel = this.panelService.createPanel({
      origin: null,
      ...this.getConfig(),
    });

    this.panel.portal = new ComponentPortal(AlertComponent, null);
    this.panel.componentRef = this.overlayRef.attach(this.panel.portal);

    this.panel.componentRef.instance.alertConfig = { ...config };
    this.panel.componentRef.instance.closeAlertCallback = this.closeAlertCallback.bind(
      this
    );

    this.panel.componentRef.instance.animationState = 'enter';
    this.timeRef = setTimeout(
      () => this.panel.componentRef.instance.closeAlert(),
      this.alertDuration
    );

    this.isOpen = true;

    return this.panel.componentRef;
  }

  public showErrorAlert(
    error: string | HttpErrorResponse,
    config?: AlertConfig
  ): ComponentRef<AlertComponent> {
    let title = isObject(error)
      ? error.error?.statusText || error.statusText
      : this.translate.instant('common.error');
    if (!title || title.toUpperCase() === 'OK' || !/\D/.test(title)) {
      title = this.translate.instant('common.error');
    }

    let text = isString(error)
      ? error
      : stringify(
          objectGetDeepestValid(
            error,
            'error.error',
            error.message || this.translate.instant('common.general_error')
          )
        );
    if (text.replace(/\W/g, '') === 'isTrustedtrue') {
      text = null;
    }

    return this.showAlert({
      alertType: AlertType.error,
      title,
      text,
      ...config,
    });
  }

  public catchErrorAndAlert(
    return$ = null
  ): OperatorFunction<unknown, unknown> {
    return catchError((error) => {
      this.showErrorAlert(error);
      return return$ || throwError(error);
    });
  }

  public showSuccessAlert(
    success: string | HttpResponse<unknown> | Response,
    config?: AlertConfig
  ): ComponentRef<AlertComponent> {
    let title =
      isObject(success) && success.statusText
        ? success.statusText
        : this.translate.instant('common.success');
    if (title.toUpperCase() === 'OK' || !/\D/.test(title)) {
      title = this.translate.instant('common.success');
    }

    let text = stringify(
      isObject(success)
        ? success['body'] || objectRemoveKey(success, 'headers')
        : success
    );
    if (text.replace(/\W/g, '') === 'isTrustedtrue') {
      text = null;
    }

    return this.showAlert({
      alertType: AlertType.success,
      title,
      text,
      ...config,
    });
  }

  private getConfig(): OverlayConfig {
    return {
      disposeOnNavigation: true,
      hasBackdrop: false,
      panelClass: '',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .top('10px'),
    };
  }

  public closeAlert(): void {
    this.panel.componentRef.instance.closeAlert();
  }

  public closeAlertCallback(): void {
    this.isOpen = false;
    clearTimeout(this.timeRef as any);
    this.panelService.destroyPanel(this.panel);
    this.panel = undefined;
  }
}

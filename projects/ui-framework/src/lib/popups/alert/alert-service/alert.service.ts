import { bind } from 'lodash';

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentRef, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  objectGetDeepestValid,
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
    if (!this.isOpen) {
      //
      this.panel = this.panelService.createPanel({
        origin: null,
        ...this.getConfig(),
      });

      this.panel.portal = new ComponentPortal(AlertComponent, null);
      this.panel.componentRef = this.overlayRef.attach(this.panel.portal);

      this.panel.componentRef.instance.alertConfig = { ...config };
      this.panel.componentRef.instance.closeAlertCallback = bind(
        this.closeAlertCallback,
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
  }

  public showErrorAlert(
    error: HttpErrorResponse,
    config?: AlertConfig
  ): ComponentRef<AlertComponent> {
    return this.showAlert({
      alertType: AlertType.error,
      title: objectGetDeepestValid(
        error,
        'error.statusText',
        this.translate.instant('common.error')
      ),
      text: stringify(
        objectGetDeepestValid(
          error,
          'error.error',
          this.translate.instant('common.general_error')
        )
      ),
      ...config,
    });
  }

  public showSuccessAlert(
    text: string,
    config?: AlertConfig
  ): ComponentRef<AlertComponent> {
    return this.showAlert({
      alertType: AlertType.success,
      title: this.translate.instant('common.success'),
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
    this.panelService.destroyPanel(this.panel);
    this.panel = undefined;
    clearTimeout(this.timeRef as any);
  }
}

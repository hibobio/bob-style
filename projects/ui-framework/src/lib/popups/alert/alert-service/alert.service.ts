import { ComponentRef, Injectable } from '@angular/core';
import { AlertConfig } from '../alert.interface';
import { AlertComponent } from '../alert/alert.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { cloneDeep, bind } from 'lodash';
import { PanelService } from '../../panel/panel.service';
import { Panel } from '../../panel/panel.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private overlay: Overlay, private panelService: PanelService) {}

  public isOpen: boolean;
  private timeRef: NodeJS.Timer;
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

      this.panel.componentRef.instance.alertConfig = cloneDeep(config);
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
    clearTimeout(this.timeRef);
  }
}

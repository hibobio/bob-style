import { ComponentRef, Injectable } from '@angular/core';
import { AlertConfig } from '../alert.interface';
import { AlertComponent } from '../alert/alert.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { cloneDeep, bind } from 'lodash';

@Injectable()
export class AlertService {
  private alertComponentRef: ComponentRef<AlertComponent>;
  private overlayConfig: OverlayConfig;
  public overlayRef: OverlayRef;
  public isOpen: boolean;
  private timeRef: NodeJS.Timer;
  private alertDuration = 7000;

  constructor(private overlay: Overlay) {}

  public showAlert(config: AlertConfig): ComponentRef<AlertComponent> {
    this.closeAlertCallback();
    if (!this.isOpen) {
      this.overlayConfig = this.getConfig();
      this.overlayRef = this.overlay.create(this.overlayConfig);
      const alertPortal = new ComponentPortal(AlertComponent, null);
      this.alertComponentRef = this.overlayRef.attach(alertPortal);
      this.alertComponentRef.instance.alertConfig = cloneDeep(config);
      this.alertComponentRef.instance.closeAlertCallback = bind(
        this.closeAlertCallback,
        this
      );
      this.isOpen = true;
      this.alertComponentRef.instance.animationState = 'enter';
      this.timeRef = setTimeout(
        () => this.alertComponentRef.instance.closeAlert(),
        this.alertDuration
      );
      return this.alertComponentRef;
    }
  }

  private getConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .top('10px');
    const panelClass = '';
    return {
      disposeOnNavigation: true,
      hasBackdrop: false,
      panelClass,
      positionStrategy,
    };
  }

  public closeAlert(): void {
    this.alertComponentRef.instance.closeAlert();
  }

  public closeAlertCallback(): void {
    this.isOpen = false;
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
    clearTimeout(this.timeRef);
  }
}

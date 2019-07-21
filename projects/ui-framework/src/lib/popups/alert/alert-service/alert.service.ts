import { ComponentRef, Injectable, Injector } from '@angular/core';
import { AlertConfig } from '../alert.interface';
import { AlertComponent } from '../alert/alert.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { cloneDeep, bind, invoke } from 'lodash';

const ALERT_DURATION = 7000;

@Injectable()
export class AlertService {
  private alertComponentRef: ComponentRef<AlertComponent>;
  private overlayConfig: OverlayConfig;
  public overlayRef: OverlayRef;
  public isOpen: boolean;
  private timeRef: NodeJS.Timer;

  constructor(
    private overlay: Overlay,
  ) {
  }

  public showAlert(config: AlertConfig): ComponentRef<AlertComponent> {
    this.closeAlertCallback();
    if (!this.isOpen) {
      this.overlayConfig = this.getConfig();
      this.overlayRef = this.overlay.create(this.overlayConfig);
      const alertPortal = new ComponentPortal(AlertComponent, null);
      this.alertComponentRef = this.overlayRef.attach(alertPortal);
      this.alertComponentRef.instance.alertConfig = cloneDeep(config);
      this.alertComponentRef.instance.closeAlertCallback = bind(this.closeAlertCallback, this);
      this.isOpen = true;
      this.alertComponentRef.instance.animationState = 'enter';
      this.timeRef = setTimeout(() => this.alertComponentRef.instance.closeAlert(), ALERT_DURATION);
      return this.alertComponentRef;
    }
  }

  private getConfig(): OverlayConfig {
    const positionStrategy = this.overlay.position().global()
      .centerHorizontally().top('20px');
    const panelClass = '';
    return {
      disposeOnNavigation: true,
      hasBackdrop: false,
      panelClass,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
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

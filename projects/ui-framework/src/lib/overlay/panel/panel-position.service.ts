import { Injectable } from '@angular/core';
import {
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  Overlay,
  PositionStrategy,
  ScrollStrategy,
  ScrollStrategyOptions
} from '@angular/cdk/overlay';

@Injectable()
export class PanelPositionService {

  constructor(
    private overlay: Overlay,
    private readonly scrollStrategyOptions: ScrollStrategyOptions,
  ) {
  }

  getDefaultPanelPositionStrategy(overlayOrigin: CdkOverlayOrigin): PositionStrategy {
    const positionStrategy: PositionStrategy = this.overlay.position()
      .flexibleConnectedTo(overlayOrigin.elementRef)
      .withPush()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
      ]);
    return positionStrategy;
  }

  getCenterPanelPositionStrategy(overlayOrigin: CdkOverlayOrigin): PositionStrategy {
    const positionStrategy: PositionStrategy = this.overlay.position()
      .flexibleConnectedTo(overlayOrigin.elementRef)
      .withPush()
      .withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
        },
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
        },
      ]);
    return positionStrategy;
  }

  getPositionClassList(change: ConnectedOverlayPositionChange): { [key: string]: boolean } {
    return {
      'panel-below': change.connectionPair.overlayY === 'top',
      'panel-above': change.connectionPair.overlayY === 'bottom',
      'panel-after': change.connectionPair.overlayX === 'start',
      'panel-before': change.connectionPair.overlayX === 'end',
    };
  }

  getScrollStrategy(): ScrollStrategy {
    return this.scrollStrategyOptions.reposition();
  }
}

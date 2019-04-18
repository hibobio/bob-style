import { Injectable } from '@angular/core';
import {
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  FlexibleConnectedPositionStrategy,
  Overlay,
  PositionStrategy,
  ScrollStrategy,
  ScrollStrategyOptions
} from '@angular/cdk/overlay';
import { ABOVE_CENTER, ABOVE_END, ABOVE_START, BELOW_CENTER, BELOW_END, BELOW_START } from './panel-position.const';
import { ConnectedPosition } from '@angular/cdk/typings/overlay';
import { concat, isEqual } from 'lodash';
import { PanelDefaultPosVer } from '../panel.enum';

@Injectable()
export class PanelPositionService {

  constructor(
    private overlay: Overlay,
    private readonly scrollStrategyOptions: ScrollStrategyOptions,
  ) {
  }

  getPanelPositionStrategy(
    overlayOrigin: CdkOverlayOrigin,
    panelDefaultPosVer: PanelDefaultPosVer,
  ): FlexibleConnectedPositionStrategy {
    const panelPosition: ConnectedPosition[] = isEqual(panelDefaultPosVer, PanelDefaultPosVer.below)
      ? concat(
        this.getBelowPositionStrategy(),
        this.getAbovePositionStrategy(),
      )
      : concat(
        this.getAbovePositionStrategy(),
        this.getBelowPositionStrategy(),
      );

    return this.overlay.position()
      .flexibleConnectedTo(overlayOrigin.elementRef)
      .withPush()
      .withPositions(panelPosition);
  }

  getCenterPanelPositionStrategy(overlayOrigin: CdkOverlayOrigin): PositionStrategy {
    const positionStrategy: PositionStrategy = this.overlay.position()
      .flexibleConnectedTo(overlayOrigin.elementRef)
      .withPush()
      .withPositions([
        BELOW_CENTER,
        ABOVE_CENTER,
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

  private getBelowPositionStrategy(): ConnectedPosition[] {
    return [
      BELOW_CENTER,
      BELOW_START,
      BELOW_END,
    ];
  }

  private getAbovePositionStrategy(): ConnectedPosition[] {
    return [
      ABOVE_CENTER,
      ABOVE_START,
      ABOVE_END,
    ];
  }
}

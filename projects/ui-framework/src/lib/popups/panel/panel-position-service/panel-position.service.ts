import { Injectable } from '@angular/core';
import {
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  FlexibleConnectedPositionStrategy,
  Overlay,
  PositionStrategy,
  ScrollStrategy,
  ScrollStrategyOptions,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import {
  ABOVE_CENTER,
  ABOVE_START,
  BELOW_CENTER,
  PANEL_POSITIONS_MAP,
} from './panel-position.const';
import { PanelDefaultPosVer } from '../panel.enum';
import { OverlayPositionClasses } from '../../../types';
import { isArray } from '../../../services/utils/functional-utils';

@Injectable()
export class PanelPositionService {
  constructor(
    private overlay: Overlay,
    private readonly scrollStrategyOptions: ScrollStrategyOptions
  ) {}

  getPanelPositionStrategy(
    overlayOrigin: CdkOverlayOrigin,
    position: PanelDefaultPosVer | ConnectedPosition[] = null
  ): FlexibleConnectedPositionStrategy {
    const panelPosition: ConnectedPosition[] = isArray(position)
      ? (position as ConnectedPosition[])
      : Object.values(PanelDefaultPosVer).includes(position)
      ? PANEL_POSITIONS_MAP[position]
      : // default
        [BELOW_CENTER, ABOVE_CENTER];

    return this.overlay
      .position()
      .flexibleConnectedTo(overlayOrigin.elementRef)
      .withPush(false)
      .withPositions(panelPosition);
  }

  getCenterPanelPositionStrategy(
    overlayOrigin: CdkOverlayOrigin
  ): PositionStrategy {
    return this.getPanelPositionStrategy(overlayOrigin, [
      BELOW_CENTER,
      ABOVE_CENTER,
    ]);
  }

  getPositionClassList(
    change: ConnectedOverlayPositionChange
  ): OverlayPositionClasses {
    return {
      'panel-below': change.connectionPair.overlayY === 'top',
      'panel-above': change.connectionPair.overlayY === 'bottom',
      'panel-after': change.connectionPair.overlayX === 'start',
      'panel-before': change.connectionPair.overlayX === 'end',
    };
  }

  getScrollStrategy(): ScrollStrategy {
    return this.overlay.scrollStrategies.reposition();
  }
}

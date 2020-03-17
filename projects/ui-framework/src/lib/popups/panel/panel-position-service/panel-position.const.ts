import {
  ConnectedPosition,
  HorizontalConnectionPos,
  VerticalConnectionPos,
} from '@angular/cdk/overlay';
import { PanelDefaultPosVer } from '../panel.enum';

export const BELOW_CENTER: ConnectedPosition = {
  originX: 'center' as HorizontalConnectionPos,
  originY: 'bottom' as VerticalConnectionPos,
  overlayX: 'center' as HorizontalConnectionPos,
  overlayY: 'top' as VerticalConnectionPos,
};

export const ABOVE_CENTER: ConnectedPosition = {
  originX: 'center' as HorizontalConnectionPos,
  originY: 'top' as VerticalConnectionPos,
  overlayX: 'center' as HorizontalConnectionPos,
  overlayY: 'bottom' as VerticalConnectionPos,
};

export const BELOW_START: ConnectedPosition = {
  originX: 'start' as HorizontalConnectionPos,
  originY: 'bottom' as VerticalConnectionPos,
  overlayX: 'start' as HorizontalConnectionPos,
  overlayY: 'top' as VerticalConnectionPos,
};

export const ABOVE_START: ConnectedPosition = {
  originX: 'start' as HorizontalConnectionPos,
  originY: 'top' as VerticalConnectionPos,
  overlayX: 'start' as HorizontalConnectionPos,
  overlayY: 'bottom' as VerticalConnectionPos,
};

export const BELOW_END: ConnectedPosition = {
  originX: 'end' as HorizontalConnectionPos,
  originY: 'bottom' as VerticalConnectionPos,
  overlayX: 'end' as HorizontalConnectionPos,
  overlayY: 'top' as VerticalConnectionPos,
};

export const ABOVE_END: ConnectedPosition = {
  originX: 'end' as HorizontalConnectionPos,
  originY: 'top' as VerticalConnectionPos,
  overlayX: 'end' as HorizontalConnectionPos,
  overlayY: 'bottom' as VerticalConnectionPos,
};

export const PANEL_POSITIONS_MAP = {
  [PanelDefaultPosVer.below]: [
    BELOW_CENTER,
    BELOW_START,
    BELOW_END,
    ABOVE_CENTER,
    ABOVE_START,
    ABOVE_END,
  ],
  [PanelDefaultPosVer.above]: [
    ABOVE_CENTER,
    ABOVE_START,
    ABOVE_END,
    BELOW_CENTER,
    BELOW_START,
    BELOW_END,
  ],
  [PanelDefaultPosVer.belowRight]: [BELOW_END, ABOVE_END],
  [PanelDefaultPosVer.belowLeft]: [BELOW_START, ABOVE_START],
  [PanelDefaultPosVer.belowLeftRight]: [
    BELOW_START,
    ABOVE_START,
    BELOW_END,
    ABOVE_END,
  ],
  [PanelDefaultPosVer.belowRightLeft]: [
    BELOW_END,
    ABOVE_END,
    BELOW_START,
    ABOVE_START,
  ],
};

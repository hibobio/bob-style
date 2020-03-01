import {
  ConnectedPosition,
  HorizontalConnectionPos,
  VerticalConnectionPos,
} from '@angular/cdk/overlay';

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

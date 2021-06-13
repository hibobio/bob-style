import { Observable, Subscription } from 'rxjs';

import {
  CdkOverlayOrigin,
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { BackdropClickMode } from '../../lists/list.enum';
import {
  DOMFocusEvent,
  DOMMouseEvent,
  OverlayPositionClasses,
} from '../../types';
import { PanelDefaultPosVer } from './panel.enum';

export interface CreatePanelConfig<T = unknown> {
  origin: CdkOverlayOrigin | ElementRef<HTMLElement> | HTMLElement;
  position?: PanelDefaultPosVer | ConnectedPosition[];
  positionStrategy?:
    | FlexibleConnectedPositionStrategy
    | GlobalPositionStrategy
    | PositionStrategy;

  viewContainerRef?: ViewContainerRef;
  templateRef?: TemplateRef<T>;
  hasBackdrop?: boolean;
  showBackdrop?: boolean;
  openOnHover?: boolean;
  panelClass?: OverlayConfig['panelClass'];
  backdropClass?: OverlayConfig['backdropClass'];
}

export interface Panel<T = unknown>
  extends Omit<
      CreatePanelConfig,
      'hasBackdrop' | 'panelClass' | 'backdropClass'
    >,
    Omit<OverlayConfig, 'positionStrategy'> {
  overlayOrigin: CdkOverlayOrigin;
  overlayRef: OverlayRef;
  positionStrategy: CreatePanelConfig['positionStrategy'];

  portal?: TemplatePortal<T> | ComponentPortal<T>;
  componentRef?: ComponentRef<T>;

  positionClasses$: Observable<OverlayPositionClasses>;
  backdropClick$: Observable<DOMMouseEvent>;
  focusOut$?: Observable<DOMFocusEvent>;

  subs?: Subscription[];
  backdropClickMode?: BackdropClickMode;

  originElement?: HTMLElement;
  overlayElement?: HTMLElement;
  panelElement?: HTMLElement;

  [key: string]: any;
}

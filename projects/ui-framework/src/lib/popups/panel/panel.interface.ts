import {
  CdkOverlayOrigin,
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BackdropClickMode } from '../../lists/list.enum';
import { OverlayPositionClasses } from '../../types';
import { PanelDefaultPosVer } from './panel.enum';

export interface CreatePanelConfig {
  origin: CdkOverlayOrigin | ElementRef<HTMLElement> | HTMLElement;
  position?: PanelDefaultPosVer | ConnectedPosition[];
  viewContainerRef?: ViewContainerRef;
  templateRef?: TemplateRef<unknown>;
  hasBackdrop?: boolean;
  showBackdrop?: boolean;
  openOnHover?: boolean;
  panelClass?: OverlayConfig['panelClass'];
  backdropClass?: OverlayConfig['backdropClass'];
}

export interface Panel<T = unknown>
  extends Omit<
      CreatePanelConfig,
      'positionStrategy' | 'hasBackdrop' | 'panelClass' | 'backdropClass'
    >,
    OverlayConfig {
  overlayOrigin: CdkOverlayOrigin;
  overlayRef: OverlayRef;
  positionStrategy: FlexibleConnectedPositionStrategy;

  portal?: TemplatePortal<T> | ComponentPortal<T>;
  componentRef?: ComponentRef<T>;

  positionClasses$: Observable<OverlayPositionClasses>;
  backdropClick$: Observable<MouseEvent>;

  subs?: Subscription[];
  backdropClickMode?: BackdropClickMode;

  [key: string]: any;
}

import { RenderedComponent } from '../../services/component-renderer/component-renderer.interface';
import { SafeResourceUrl } from '@angular/platform-browser';
import { OverlayRef } from '@angular/cdk/overlay';
import { LightboxComponent } from './lightbox.component';
import { ComponentRef } from '@angular/core';
import { Observable } from 'rxjs';

export interface LightboxConfig {
  component?: RenderedComponent;
  image?: string | SafeResourceUrl;
  video?: string | SafeResourceUrl;
  iframe?: string | SafeResourceUrl;
  fillScreen?: boolean;
  disableClose?: boolean;
  closeOnBackdropClick?: boolean;
}

export interface LightboxData {
  overlayRef: OverlayRef;
  lightboxComponentRef: ComponentRef<LightboxComponent>;
  config?: LightboxConfig;
  close?: Function;
  closed$?: Observable<void>;
}

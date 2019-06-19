import { RenderedComponent } from '../../services/component-renderer/component-renderer.interface';
import { SafeResourceUrl } from '@angular/platform-browser';
import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LightboxComponent } from './lightbox.component';
import { ComponentRef } from '@angular/core';

export interface LightboxConfig {
  component?: RenderedComponent;
  image?: string;
  video?: string | SafeResourceUrl;
  fillScreen?: boolean;
}

export interface LightboxData {
  overlayRef: OverlayRef;
  lightboxPortal: ComponentPortal<LightboxComponent>;
  lightboxComponentRef: ComponentRef<LightboxComponent>;
  config?: LightboxConfig;
}

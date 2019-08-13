import { Injectable, SimpleChange } from '@angular/core';
import { LightboxConfig, LightboxData } from './lightbox.interface';
import { LightboxComponent } from './lightbox.component';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { URLutils } from '../../services/url/url-utils.service';

@Injectable()
export class LightboxService {
  constructor(private overlay: Overlay, private url: URLutils) {}

  private overlayConfig: OverlayConfig = {
    disposeOnNavigation: true,
    hasBackdrop: false,
    panelClass: 'b-lightbox-panel',
    positionStrategy: this.overlay.position().global(),
    scrollStrategy: this.overlay.scrollStrategies.block()
  };

  public showLightbox(config: LightboxConfig): LightboxData {
    const lightbox: Partial<LightboxData> = {};
    let lightboxPortal: ComponentPortal<LightboxComponent>;

    try {
      lightbox.config = {
        image: config.image && this.url.validateImg(config.image),
        video: config.video && this.url.domainAllowed(config.video as string),
        component: config.component,
        fillScreen: config.fillScreen
      };

      lightbox.overlayRef = this.overlay.create(this.overlayConfig);
      lightboxPortal = new ComponentPortal(LightboxComponent);
      lightbox.lightboxComponentRef = lightbox.overlayRef.attach(
        lightboxPortal
      );

      lightbox.lightboxComponentRef.instance.ngOnChanges({
        config: new SimpleChange(null, lightbox.config, true)
      });

      lightbox.lightboxComponentRef.instance.closeLightboxCallback = () =>
        this.closeLightbox(lightbox as LightboxData);

      lightbox.overlayRef.overlayElement.addEventListener('click', () =>
        this.closeLightbox(lightbox as LightboxData)
      );

      lightbox.close = () => this.closeLightbox(lightbox as LightboxData);
      return lightbox as LightboxData;
    } catch (e) {
      this.closeLightbox(lightbox as LightboxData);
      throw new Error(e.message);
    }
  }

  public closeLightbox(lightbox: LightboxData): void {
    if (lightbox && lightbox.lightboxComponentRef) {
      lightbox.lightboxComponentRef.destroy();
      lightbox.lightboxComponentRef = null;
    }
    if (lightbox && lightbox.overlayRef) {
      lightbox.overlayRef.dispose();
      lightbox.overlayRef = null;
    }
    lightbox = null;
  }
}

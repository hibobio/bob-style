import { Injectable, SimpleChange } from '@angular/core';
import { LightboxConfig, LightboxData } from './lightbox.interface';
import { LightboxComponent } from './lightbox.component';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { URLutils } from '../../services/url/url-utils.service';
import { take } from 'rxjs/operators';

@Injectable()
export class LightboxService {
  lightbox: LightboxData;
  constructor(private overlay: Overlay, private url: URLutils) {}

  private overlayConfig: OverlayConfig = {
    disposeOnNavigation: true,
    hasBackdrop: false,
    panelClass: 'b-lightbox-panel',
    positionStrategy: this.overlay.position().global(),
    scrollStrategy: this.overlay.scrollStrategies.block(),
  };

  public showLightbox(config: LightboxConfig): LightboxData {
    this.lightbox = {
      overlayRef: null,
      lightboxComponentRef: null,
    };
    let lightboxPortal: ComponentPortal<LightboxComponent>;

    try {
      this.lightbox.config = {
        image: config.image && this.url.validateImg(config.image),
        video: config.video && this.url.domainAllowed(config.video as string),
        component: config.component,
        fillScreen: config.fillScreen,
      };

      this.lightbox.overlayRef = this.overlay.create(this.overlayConfig);
      lightboxPortal = new ComponentPortal(LightboxComponent);
      this.lightbox.lightboxComponentRef = this.lightbox.overlayRef.attach(
        lightboxPortal
      );

      this.lightbox.lightboxComponentRef.instance.ngOnChanges({
        config: new SimpleChange(null, this.lightbox.config, true),
      });

      this.lightbox.lightboxComponentRef.instance.closeLightboxCallback = () =>
        this.closeLightbox();

      this.lightbox.overlayRef.overlayElement.addEventListener('click', () =>
        this.closeLightbox()
      );

      this.lightbox.close = () => this.closeLightbox();

      this.lightbox.closed$ = this.lightbox.overlayRef
        .detachments()
        .pipe(take(1));

      return this.lightbox as LightboxData;
    } catch (e) {
      this.closeLightbox();
      throw new Error(e.message);
    }
  }

  public closeLightbox(): void {
    if (this.lightbox && this.lightbox.lightboxComponentRef) {
      this.lightbox.lightboxComponentRef.destroy();
      this.lightbox.lightboxComponentRef = null;
    }
    if (this.lightbox && this.lightbox.overlayRef) {
      this.lightbox.overlayRef.dispose();
      this.lightbox.overlayRef = null;
    }
    this.lightbox = null;
  }
}

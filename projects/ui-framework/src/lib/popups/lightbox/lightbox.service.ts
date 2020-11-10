import { Injectable, NgZone, SimpleChange } from '@angular/core';
import { LightboxConfig, LightboxData } from './lightbox.interface';
import { LightboxComponent } from './lightbox.component';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { URLutils } from '../../services/url/url-utils.service';
import { filter, take } from 'rxjs/operators';
import { fromEvent, merge, Subscription } from 'rxjs';
import { WindowRef } from '../../services/utils/window-ref.service';
import { UtilsService } from '../../services/utils/utils.service';
import { isKey } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { insideZone } from '../../services/utils/rxjs.operators';

@Injectable()
export class LightboxService {
  lightbox: LightboxData;
  constructor(
    private overlay: Overlay,
    private url: URLutils,
    private utilsService: UtilsService,
    private windowRef: WindowRef,
    private zone: NgZone
  ) {}

  private subs: Subscription[] = [];

  private overlayConfig: OverlayConfig = {
    disposeOnNavigation: true,
    hasBackdrop: false,
    panelClass: 'b-lightbox-panel',
    positionStrategy: this.overlay.position().global(),
    scrollStrategy: this.overlay.scrollStrategies.block(),
  };

  public showLightbox(config: LightboxConfig): LightboxData {
    if (this.lightbox) {
      return;
    }

    this.lightbox = {
      overlayRef: null,
      lightboxComponentRef: null,
    };
    let lightboxPortal: ComponentPortal<LightboxComponent>;

    try {
      this.lightbox.config = {
        ...config,
        image: config.image && this.url.validateImg(config.image),
        video: config.video && this.url.domainAllowed(config.video as string),
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

      this.lightbox.close = () => this.closeLightbox();

      this.lightbox.closed$ = this.lightbox.overlayRef
        .detachments()
        .pipe(take(1));

      this.windowRef.nativeWindow.history.pushState(
        {
          lightbox: true,
          desc: 'lightbox is open',
        },
        null
      );

      this.subs.push(
        merge(
          fromEvent(this.lightbox.overlayRef.overlayElement, 'click'),
          fromEvent(this.windowRef.nativeWindow as Window, 'popstate'),
          this.utilsService.getWindowKeydownEvent(true).pipe(
            filter((event: KeyboardEvent) => isKey(event.key, Keys.escape)),
            insideZone(this.zone)
          )
        )
          .pipe(take(1))
          .subscribe(() => {
            this.closeLightbox();
          })
      );

      return this.lightbox as LightboxData;
      //
    } catch (e) {
      this.closeLightbox();
      throw new Error(e.message);
    }
  }

  public closeLightbox(): void {
    if (!this.lightbox) {
      return;
    }

    this.lightbox.lightboxComponentRef?.destroy();
    this.lightbox.overlayRef?.dispose();

    this.lightbox.lightboxComponentRef = null;
    this.lightbox.overlayRef = null;
    this.lightbox = null;

    if (this.windowRef.nativeWindow.history.state?.lightbox) {
      this.windowRef.nativeWindow.history.back();
    }

    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    this.subs.length = 0;
  }
}

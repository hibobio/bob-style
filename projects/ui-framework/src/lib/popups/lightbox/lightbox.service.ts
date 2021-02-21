import { Injectable, NgZone, SimpleChange } from '@angular/core';
import { LightboxConfig, LightboxData } from './lightbox.interface';
import { LightboxComponent } from './lightbox.component';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { URLutils } from '../../services/url/url-utils.service';
import { take } from 'rxjs/operators';
import { EMPTY, fromEvent, merge, Subscription } from 'rxjs';
import { WindowRef } from '../../services/utils/window-ref.service';
import { UtilsService } from '../../services/utils/utils.service';
import { Keys } from '../../enums';
import { filterKey, insideZone } from '../../services/utils/rxjs.operators';
import {
  isSafeUrl,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { AlertService } from '../alert/alert-service/alert.service';

@Injectable({
  providedIn: 'root',
})
export class LightboxService {
  lightbox: LightboxData;
  constructor(
    private overlay: Overlay,
    private url: URLutils,
    private utilsService: UtilsService,
    private alertService: AlertService,
    private windowRef: WindowRef,
    private zone: NgZone
  ) {
    this.isEmbedMode = this.windowRef.isEmbedMode();
  }

  private subs: Subscription[] = [];
  private readonly isEmbedMode: boolean;

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
        image:
          config.image &&
          (isSafeUrl(config.image)
            ? config.image
            : this.url.validateImgUrl(config.image as string)),
        video:
          config.video &&
          (isSafeUrl(config.video)
            ? config.video
            : this.url.validateVideoUrl(config.video as string)),
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

      !this.isEmbedMode &&
        this.windowRef.nativeWindow.history.pushState(
          {
            lightbox: true,
            desc: 'lightbox is open',
          },
          null
        );

      this.subs.push(
        merge(
          config.closeOnBackdropClick === true && config.disableClose !== true
            ? fromEvent(this.lightbox.overlayRef.overlayElement, 'click')
            : EMPTY,

          config.disableClose !== true
            ? this.utilsService
                .getWindowKeydownEvent(true)
                .pipe(filterKey(Keys.escape), insideZone(this.zone))
            : EMPTY,

          !this.isEmbedMode
            ? fromEvent(this.windowRef.nativeWindow as Window, 'popstate')
            : EMPTY,

          !this.isEmbedMode
            ? this.utilsService.getWindowMessageEvents({
                type: ['LIGHTBOX_CLOSE'],
              })
            : EMPTY
        )
          .pipe(take(1))
          .subscribe(() => {
            this.closeLightbox();
          })
      );

      !this.isEmbedMode &&
        this.subs.push(
          this.utilsService
            .getWindowMessageEvents({
              type: ['LIGHTBOX_SHOW_ALERT'],
            })
            .subscribe(({ payload }) => {
              this.alertService.showAlert(payload);
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

    if (
      !this.isEmbedMode &&
      this.windowRef.nativeWindow.history.state?.lightbox
    ) {
      this.windowRef.nativeWindow.history.back();
    }

    unsubscribeArray(this.subs);
  }
}

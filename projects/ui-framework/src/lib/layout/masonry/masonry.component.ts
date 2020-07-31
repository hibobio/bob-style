import {
  Component,
  OnInit,
  Input,
  ElementRef,
  NgZone,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { MasonryConfig, MasonryState } from './masonry.interface';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import { throttleTime, filter, tap, skip } from 'rxjs/operators';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { InputObservable } from '../../services/utils/decorators';
import { merge, Subscription, Subject, Observable } from 'rxjs';
import { WindowRef, WindowLike } from '../../services/utils/window-ref.service';
import { MasonryService } from './masonry.service';
import { MASONRY_CONFIG_DEF } from './masonry.const';

@Component({
  selector: 'b-masonry-layout',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.scss'],
})
export class MasonryLayoutComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private windowRef: WindowRef,
    private utilsService: UtilsService,
    private DOM: DOMhelpers,
    private host: ElementRef,
    private zone: NgZone,
    private service: MasonryService
  ) {
    this.hostEl = this.host.nativeElement;
    this.nativeWindow = this.windowRef.nativeWindow;
  }

  // tslint:disable-next-line: no-input-rename
  @InputObservable({ ...MASONRY_CONFIG_DEF })
  @Input('config')
  public config$: Observable<MasonryConfig>;

  private changeDetection$: Subject<void> = new Subject<void>();

  private nativeWindow: WindowLike;
  public hostEl: HTMLElement;
  private config: MasonryConfig;
  private state: MasonryState = {};
  private observer: MutationObserver;
  private updater: Subscription;

  private elementsToUpdate: Set<HTMLElement> = new Set();

  ngOnInit() {
    this.updater = merge(
      this.config$.pipe(
        tap((config: MasonryConfig) => {
          this.config = this.service.processConfig(config);
        })
      ),
      this.utilsService.getResizeEvent().pipe(
        outsideZone(this.zone),
        skip(1),
        filter(
          () =>
            this.hostEl &&
            this.state.hostWidth &&
            Math.abs(this.state.hostWidth - this.hostEl.offsetWidth) > 20
        )
      ),
      this.changeDetection$
    )
      .pipe(
        throttleTime(100, undefined, {
          leading: false,
          trailing: true,
        })
      )
      .subscribe(() => {
        if (!this.hostEl?.children.length) {
          return;
        }

        this.zone.runOutsideAngular(() => {
          if (!this.state.config || this.elementsToUpdate.size === 0) {
            this.elementsToUpdate.clear();
            this.service.initMasonry(this.hostEl, this.config, this.state);
            return;
          }

          const elements = Array.from(this.elementsToUpdate);
          this.elementsToUpdate.clear();

          this.service.updateElementsRowSpan(elements, this.config);
        });
      });

    this.zone.runOutsideAngular(() => {
      if (this.nativeWindow.MutationObserver) {
        //
        this.observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation: MutationRecord) => {
            const target = this.DOM.getClosestUntil(
              mutation.target,
              'b-masonry-layout > *',
              this.hostEl
            );

            if (target && target !== this.hostEl) {
              this.elementsToUpdate.add(target);
            }
          });
          this.changeDetection$.next();
        });

        this.observer.observe(this.hostEl, {
          childList: true,
          subtree: true,
          characterData: true,
          attributeFilter: ['src', 'data-loaded'],
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.changeDetection$.next();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.updater?.unsubscribe();
  }
}

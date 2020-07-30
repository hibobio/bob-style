import {
  Component,
  OnInit,
  Input,
  ElementRef,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { MasonryConfig, MasonryState } from './masonry.interface';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { throttleTime, filter, tap } from 'rxjs/operators';
import { InputObservable } from '../../services/utils/decorators';
import { merge, Subscription, Observable } from 'rxjs';
import { MasonryService } from './masonry.service';
import { MASONRY_CONFIG_DEF } from './masonry.const';
import { MutationObservableService } from '../../services/utils/mutation-observable';

@Component({
  selector: 'b-masonry-layout',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.scss'],
})
export class MasonryLayoutComponent implements OnInit, OnDestroy {
  constructor(
    private DOM: DOMhelpers,
    private host: ElementRef,
    private zone: NgZone,
    private mutationObservableService: MutationObservableService,
    private service: MasonryService
  ) {
    this.hostEl = this.host.nativeElement;
  }

  @Input() debug = false;

  // tslint:disable-next-line: no-input-rename
  @InputObservable({ ...MASONRY_CONFIG_DEF })
  @Input('config')
  public config$: Observable<MasonryConfig>;

  public hostEl: HTMLElement;
  private config: MasonryConfig;
  private state: MasonryState = {};
  private updater: Subscription;

  private elementsToUpdate: Set<HTMLElement> = new Set();

  private disabled = false;

  ngOnInit() {
    this.updater = merge(
      this.config$.pipe(
        tap((config: MasonryConfig) => {
          this.config = this.service.processConfig(config);

          if (this.debug) {
            console.log('Masonry: new config:', this.config);
          }
        })
      ),

      this.mutationObservableService
        .getMutationObservable(this.hostEl, {
          characterData: true,
          childList: true,
          subtree: true,
          attributeFilter: ['src', 'data-loaded', 'data-updated'],
          mutations: 'processed',
          filterSelector: 'b-masonry-layout > *',
        })
        .pipe(
          tap((elementsToUpdate) => {
            this.elementsToUpdate = new Set([
              ...this.elementsToUpdate,
              ...elementsToUpdate,
            ]);
          })
        ),

      this.mutationObservableService
        .getResizeObservervable(this.hostEl, {
          watch: 'width',
          threshold: 20,
        })
        .pipe(
          tap(() => {
            console.log(
              `Masonry: host resized, prev hostWidth: ${this.state.hostWidth}, new hostWidth: ${this.hostEl.offsetWidth}`
            );

            this.state.hostWidth = this.hostEl.offsetWidth;
          })
        )
    )
      .pipe(
        throttleTime(100, undefined, {
          leading: false,
          trailing: true,
        }),

        filter(() => Boolean(this.hostEl?.children.length))
      )
      .subscribe(() => {
        // if (
        //   this.config.columnWidth &&
        //   this.state.hostWidth &&
        //   this.disabled ===
        //     this.config.columnWidth * 2 + this.config.gap > this.state.hostWidth
        // ) {
        //   if (this.debug) {
        //     console.log(
        //       `Masonry: hostWidth (${this.state.hostWidth}) too narrow for more than 1 column (of min-width ${this.config.columnWidth}), converting to single column`
        //     );
        //   }

        //   this.observer?.disconnect();
        //   this.service.cleanupMasonry(this.hostEl);

        //   this.hostEl.classList.add('single-column');

        //   return;
        // }

        this.zone.runOutsideAngular(() => {
          if (!this.state.config || this.elementsToUpdate.size === 0) {
            this.elementsToUpdate.clear();
            this.init(this.config);
            return;
          }

          if (this.debug) {
            console.log(
              'Masonry update: ' + this.elementsToUpdate.size + ' items.'
            );
          }

          const elements = Array.from(this.elementsToUpdate);
          this.elementsToUpdate.clear();

          this.service.updateElementsRowSpan(elements, this.config);
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy(false);
  }

  public init(config: MasonryConfig = this.config): void {
    if (this.debug) {
      console.log('Masonry: init');
    }
    if (!this.updater) {
      this.ngOnInit();
    }
    this.service.initMasonry(this.hostEl, config, this.state);
  }

  public destroy(fullCleanup = true): void {
    if (this.debug) {
      console.log('Masonry: destroy');
    }
    this.updater?.unsubscribe();

    if (fullCleanup) {
      this.state = {};
      this.updater = undefined;
      this.service.cleanupMasonry(this.hostEl);
    }
  }
}

import {
  Component,
  OnInit,
  Input,
  ElementRef,
  OnDestroy,
  NgZone,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  MasonryConfig,
  MasonryItemsChangedEvent,
  MasonryState,
} from './masonry.interface';
import { throttleTime, filter, tap } from 'rxjs/operators';
import { InputObservable } from '../../services/utils/decorators';
import { merge, Subscription, Observable } from 'rxjs';
import { MasonryService } from './masonry.service';
import { MASONRY_CONFIG_DEF } from './masonry.const';
import { MutationObservableService } from '../../services/utils/mutation-observable';

@Component({
  selector: 'b-masonry-item',
  template: `<ng-content></ng-content>`,
  styles: [],
})
export class MasonryItemComponent {}

@Component({
  selector: 'b-masonry-layout',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./masonry.component.scss'],
})
export class MasonryLayoutComponent implements OnInit, OnDestroy {
  constructor(
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

  @Output() masonryItemsChanged: EventEmitter<
    MasonryItemsChangedEvent
  > = new EventEmitter<MasonryItemsChangedEvent>();

  public hostEl: HTMLElement;
  private config: MasonryConfig;
  private state: MasonryState = {};
  private updater: Subscription;
  private subs: Subscription[] = [];
  private elementsToUpdate: Set<HTMLElement> = new Set();
  private intersectionObserver: IntersectionObserver;
  private inViewUpdater: Subscription;
  private intersectionObservedElements: Set<HTMLElement> = new Set();

  public markInView = false;

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.subs.push(
        (this.updater = merge(
          this.config$.pipe(
            tap((config: MasonryConfig) => {
              this.config = this.service.processConfig(config);
              this.state.config = undefined;

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
              filterSelector: 'b-masonry-item, b-masonry-layout > *',
            })
            .pipe(
              tap((elementsToUpdate) => {
                this.elementsToUpdate = new Set([
                  ...this.elementsToUpdate,
                  ...elementsToUpdate,
                ]);

                this.state.childrenCount = this.hostEl?.children.length;
              })
            ),

          this.mutationObservableService
            .getResizeObservervable(this.hostEl, {
              watch: 'width',
              threshold: 20,
            })
            .pipe(
              tap(() => {
                if (this.debug) {
                  console.log(
                    `Masonry: host resized, prev hostWidth: ${this.state.hostWidth}, new hostWidth: ${this.hostEl.offsetWidth}`
                  );
                }
                this.state.hostWidth = this.hostEl.offsetWidth;
                delete this.state.columns;
              })
            )
        )
          .pipe(
            throttleTime(100, undefined, {
              leading: false,
              trailing: true,
            }),

            filter(() => Boolean(this.state.childrenCount))
          )
          .subscribe(() => {
            if (
              this.config.columnWidth &&
              this.state.hostWidth &&
              this.config.columnWidth * 2 + this.config.gap >
                this.state.hostWidth
            ) {
              if (this.state.singleColumn) {
                return;
              }

              if (this.debug) {
                console.log(
                  `Masonry: hostWidth (${this.state.hostWidth}) too narrow for more than 1 column (of min-width ${this.config.columnWidth}), converting to single column`
                );
              }

              this.service.cleanupMasonry(this.hostEl);
              this.state.singleColumn = true;

              return;
            }

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

            this.service.updateElementsRowSpan(
              elements,
              this.hostEl,
              this.config,
              {
                emitter: this.masonryItemsChanged,
                debug: this.debug,
              }
            );
          }))
      );

      if (this.markInView) {
        this.subs.push(
          (this.inViewUpdater = this.mutationObservableService
            .getMutationObservable(this.hostEl, {
              childList: true,
              characterData: false,
              subtree: false,
              mutations: 'processed',
              filterSelector: 'b-masonry-item, b-masonry-layout > *',
            })
            .subscribe((addedElements) => {
              if (this.debug) {
                console.log('addedElements', addedElements);
              }

              if (this.state.singleColumn) {
                return;
              }

              addedElements.forEach((element) => {
                if (!this.intersectionObservedElements.has(element)) {
                  this.intersectionObservedElements.add(element);

                  this.subs.push(
                    this.mutationObservableService
                      .getIntersectionObservable(
                        element,
                        {},
                        this.intersectionObserver
                      )
                      .pipe(
                        tap((entry) => {
                          if (!this.intersectionObserver) {
                            this.intersectionObserver = entry.observer;
                          }
                        })
                      )
                      .subscribe((entry) => {
                        if (this.state.singleColumn || !this.state) {
                          return;
                        }

                        if (entry.isIntersecting) {
                          element.setAttribute('data-in-view', 'true');
                        } else {
                          element.setAttribute('data-in-view', 'false');
                        }
                      })
                  );
                }
              });
            }))
        );
      }
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
    this.service.initMasonry(this.hostEl, config, this.state, {
      emitter: this.masonryItemsChanged,
      debug: this.debug,
    });
  }

  public destroy(fullCleanup = true): void {
    if (this.debug) {
      console.log('Masonry: destroy');
    }
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    this.subs.length = 0;

    this.intersectionObserver?.disconnect();
    this.intersectionObserver = undefined;

    if (fullCleanup) {
      this.state = {};
      this.updater = undefined;
      this.inViewUpdater = undefined;
      this.service.cleanupMasonry(this.hostEl);
    }
  }
}

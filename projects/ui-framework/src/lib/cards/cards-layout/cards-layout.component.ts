import {
  Component,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  NgZone,
  ChangeDetectorRef,
  OnInit,
  ContentChildren,
  QueryList,
  HostBinding
} from '@angular/core';
import { CardType } from '../cards.enum';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { MobileService, MediaEvent } from '../../services/utils/mobile.service';
import { CARD_TYPE_WIDTH, GAP_SIZE } from './cards-layout.const';
import { BaseCardElement } from '../card/card.abstract';
import { simpleUID } from '../../services/utils/functional-utils';
import { Swiper } from 'swiper/dist/js/swiper.esm.js';

@Component({
  selector: 'b-cards',
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsLayoutComponent
  implements AfterViewInit, OnDestroy, OnChanges, OnInit {
  constructor(
    private hostRef: ElementRef,
    private domUtils: DOMhelpers,
    private utilsService: UtilsService,
    private mobileService: MobileService,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  isMobile = false;
  private swiper: Swiper;

  private resizeSubscription: Subscription;
  private cardsInRow$: BehaviorSubject<number>;
  private cardsInRow: number;
  private mediaEventSubscriber: Subscription;

  @ContentChildren(BaseCardElement) public cards: QueryList<BaseCardElement>;

  @Input() alignCenter = false;
  @Input() type: CardType = CardType.regular;
  @Output() cardsAmountChanged: EventEmitter<number> = new EventEmitter<
    number
  >();

  @HostBinding('attr.data-mobile-swiper') @Input() mobileSwiper = true;
  @HostBinding('attr.id') cardsListId = simpleUID('cards-list-');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type && !changes.type.firstChange) {
      this.type = changes.type.currentValue;
      this.setCssVars();
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setCssVars();
    this.cardsInRow = this.calcCardsInRow();

    this.mediaEventSubscriber = this.mobileService
      .getMediaEvent()
      .pipe(outsideZone(this.zone))
      .subscribe((media: MediaEvent) => {
        this.isMobile = media.matchMobile;
        if (this.mobileSwiper && this.isMobile) {
          this.initSwiper();
        } else if (this.swiper) {
          this.swiper.destroy();
          this.setCssVars();
        }
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
    if (this.mediaEventSubscriber && this.mediaEventSubscriber.unsubscribe) {
      this.mediaEventSubscriber.unsubscribe();
    }
  }

  getCardsInRow$(): Observable<number> {
    this.cardsInRow = this.calcCardsInRow();
    if (!this.cardsInRow$) {
      this.cardsInRow$ = new BehaviorSubject<number>(this.cardsInRow);
      this.resizeSubscription = this.utilsService
        .getResizeEvent()
        .pipe(
          outsideZone(this.zone),
          filter(() => {
            const cardsInRow = this.calcCardsInRow();
            return this.cardsInRow !== cardsInRow;
          })
        )
        .subscribe(() => {
          this.zone.run(() => {
            this.cardsInRow = this.calcCardsInRow();
            this.cardsInRow$.next(this.cardsInRow);
            if (this.cardsAmountChanged.observers.length > 0) {
              this.cardsAmountChanged.emit(this.cardsInRow);
            }
          });
        });
    }
    return this.cardsInRow$ as Observable<number>;
  }

  private initSwiper(): void {
    this.swiper = new Swiper('#' + this.cardsListId, {
      wrapperClass: 'cards-list',
      slideClass: 'single-card',
      spaceBetween: GAP_SIZE,
      centeredSlides: true,
      centerInsufficientSlides: true,
      roundLengths: true,

      breakpoints:
        this.type === CardType.large
          ? {
              800: {
                slidesPerView: 2
              },
              450: {
                slidesPerView: 1
              }
            }
          : this.type === CardType.regular
          ? {
              800: {
                slidesPerView: 3
              },
              450: {
                slidesPerView: 2
              },
              330: {
                slidesPerView: 1
              }
            }
          : {
              800: {
                slidesPerView: 4
              },
              530: {
                slidesPerView: 3
              },
              360: {
                slidesPerView: 1
              }
            }
    });
  }

  private setCssVars(): void {
    this.domUtils.setCssProps(this.hostRef.nativeElement, {
      '--card-width': CARD_TYPE_WIDTH[this.type] + 'px',
      '--card-grid-gap': GAP_SIZE + 'px'
    });
  }

  private calcCardsInRow(): number {
    const hostWidth = this.domUtils.getInnerWidth(this.hostRef.nativeElement);
    const gaps =
      (Math.floor(hostWidth / CARD_TYPE_WIDTH[this.type]) - 1) * GAP_SIZE;
    return Math.floor((hostWidth - gaps) / CARD_TYPE_WIDTH[this.type]);
  }
}

import {
  Component,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ElementRef,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  ContentChildren,
  QueryList,
  OnInit,
  AfterContentInit,
  NgZone,
} from '@angular/core';
import { CardType } from '../cards.enum';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  CARD_TYPE_WIDTH,
  GAP_SIZE,
  CARD_TYPE_WIDTH_MOBILE,
} from './cards-layout.const';
import { BaseCardElement } from '../card/card.abstract';
import { MediaEvent, MobileService } from '../../services/utils/mobile.service';
import {
  applyChanges,
  notFirstChanges,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { ItemsInRowService } from '../../services/items-in-row/items-in-row.service';
import { outsideZone } from '../../services/utils/rxjs.operators';

@Component({
  selector: 'b-cards',
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsLayoutComponent
  implements OnDestroy, OnChanges, OnInit, AfterContentInit {
  constructor(
    private hostRef: ElementRef,
    private zone: NgZone,
    private mobileService: MobileService,
    private cd: ChangeDetectorRef,
    private itemsInRowService: ItemsInRowService
  ) {
    this.isMobile = this.mobileService.isMobile();
  }

  @ContentChildren(BaseCardElement) public cards: QueryList<BaseCardElement>;

  @Input() alignCenter: boolean | 'auto' = false;
  @Input() mobileSwiper = false;
  @Input() swiper: 'desktop' | 'mobile' | 'both' | boolean = false;
  @Input() type: CardType = CardType.regular;

  @Output() cardsAmountChanged: EventEmitter<number> = new EventEmitter<
    number
  >();

  public cardsInRow$: Observable<number>;
  public cardsInRow = 1;
  public isMobile = false;
  private readonly subs: Subscription[] = [];

  getCardsInRow$(): Observable<number> {
    return this.cardsInRow$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes, {
      type: CardType.regular,
      alignCenter: false,
    });

    if (this.mobileSwiper && this.swiper !== 'both' && this.swiper !== true) {
      this.swiper === 'mobile';
    }

    if (notFirstChanges(changes, ['type'])) {
      this.ngOnInit();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.cardsInRow$ = this.itemsInRowService
      .getItemsInRow$({
        hostElem: this.hostRef.nativeElement,
        elemWidth: this.getCardWidth(),
        gapSize: GAP_SIZE,
        minItems: 1,
        update$: this.mobileService.getMediaEvent().pipe(
          outsideZone(this.zone),
          tap((mediaEvent: MediaEvent) => {
            this.isMobile = mediaEvent.isMobile;
          }),
          map(() => [null, this.getCardWidth(), null])
        ),
      })
      .pipe(
        tap((cardsInRow) => {
          this.cardsInRow = cardsInRow;
        })
      );
  }

  ngAfterContentInit(): void {
    this.subs.push(
      this.cards.changes.subscribe(() => {
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      })
    );
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);
  }

  private getCardWidth(type = this.type, isMobile = this.isMobile): number {
    return !isMobile ? CARD_TYPE_WIDTH[type] : CARD_TYPE_WIDTH_MOBILE[type];
  }

  public hasEnoughCards() {
    return (
      this.cards && this.cardsInRow < this.cards.length && this.cards.length > 1
    );
  }

  public isSwiperEnabled() {
    return (
      (this.swiper === true ||
        (this.isMobile && this.swiper && this.swiper !== 'desktop') ||
        (!this.isMobile && this.swiper && this.swiper !== 'mobile')) &&
      this.hasEnoughCards()
    );
  }

  public isAlignedCenter() {
    return (
      this.alignCenter === true ||
      (this.alignCenter === 'auto' && !this.hasEnoughCards())
    );
  }
}

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { ItemsInRowService } from '../../services/items-in-row/items-in-row.service';
import {
  applyChanges,
  notFirstChanges,
} from '../../services/utils/functional-utils';
import { MediaEvent, MobileService } from '../../services/utils/mobile.service';
import { CardType } from '../cards.enum';
import {
  CARD_TYPE_WIDTH,
  CARD_TYPE_WIDTH_MOBILE,
  GAP_SIZE,
} from './cards-layout.const';

@Component({
  selector: 'b-cards',
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsLayoutComponent implements OnChanges, OnInit, OnDestroy {
  constructor(
    public hostElRef: ElementRef,
    private mobileService: MobileService,
    private cd: ChangeDetectorRef,
    private itemsInRowService: ItemsInRowService
  ) {
    this.isMobile = this.mobileService.isMobile();
  }

  @ViewChild('cardsList', { static: true }) private cardsList: ElementRef;

  @Input() alignCenter: boolean | 'auto' = false;
  @Input() mobileSwiper = false;
  @Input() swiper: 'desktop' | 'mobile' | 'both' | boolean = false;
  @Input() type: CardType = CardType.regular;
  @Input() cardWidth: number;

  @Output()
  cardsAmountChanged: EventEmitter<number> = new EventEmitter<number>();

  public cardsInRow$: BehaviorSubject<number> = new BehaviorSubject(1);
  public get cardsInRow() {
    return this.cardsInRow$.getValue();
  }

  public totalCards: number;
  public isMobile = false;
  private itemsInRowSub: Subscription;

  getCardsInRow$(): Observable<number> {
    return this.cardsInRow$.asObservable();
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
      this.setCardsInRow();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.setCardsInRow();
  }

  private setCardsInRow(): void {
    this.itemsInRowSub?.unsubscribe();

    this.itemsInRowSub = this.itemsInRowService
      .getItemsInRow$({
        hostElem: this.cardsList.nativeElement,
        elemWidth: this.getCardWidth(),
        gapSize: GAP_SIZE,
        minItems: 1,
        update$: this.mobileService.getMediaEvent(true).pipe(
          tap((mediaEvent: MediaEvent) => {
            this.isMobile = mediaEvent.isMobile;
          }),
          map(() => [null, this.getCardWidth(), null])
        ),
        extended: false,
      })
      .pipe(
        tap(() => {
          this.totalCards =
            this.cardsList?.nativeElement.childElementCount || 0;
          this.cd.detectChanges();
        })
      )
      .subscribe(this.cardsInRow$);
  }

  private getCardWidth(type = this.type, isMobile = this.isMobile): number {
    return (
      this.cardWidth ||
      (!isMobile ? CARD_TYPE_WIDTH[type] : CARD_TYPE_WIDTH_MOBILE[type])
    );
  }

  public hasEnoughCards() {
    return this.cardsInRow < this.totalCards && this.totalCards > 1;
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

  ngOnDestroy(): void {
    this.itemsInRowSub?.unsubscribe();
  }
}

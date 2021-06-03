import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { ItemsInRowService } from '../../services/items-in-row/items-in-row.service';
import {
  applyChanges,
  notFirstChanges,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { MediaEvent, MobileService } from '../../services/utils/mobile.service';
import { CardType } from '../cards.enum';
import {
  CARD_TYPE_WIDTH,
  CARD_TYPE_WIDTH_MOBILE,
  GAP_SIZE,
} from './cards-layout.const';
import { MutationObservableService } from '../../services/utils/mutation-observable';

@Component({
  selector: 'b-cards',
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsLayoutComponent
  implements OnDestroy, OnChanges, AfterContentInit {
  constructor(
    public hostElRef: ElementRef,
    private zone: NgZone,
    private mobileService: MobileService,
    private cd: ChangeDetectorRef,
    private itemsInRowService: ItemsInRowService,
    private mutationObservableService: MutationObservableService
  ) {
    this.isMobile = this.mobileService.isMobile();
    this.setCardsInRow();
  }

  @ViewChild('cardsList', { static: true }) private cardsList: ElementRef;

  @Input() alignCenter: boolean | 'auto' = false;
  @Input() mobileSwiper = false;
  @Input() swiper: 'desktop' | 'mobile' | 'both' | boolean = false;
  @Input() type: CardType = CardType.regular;
  @Input() cardWidth: number;

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
      this.setCardsInRow();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  private setCardsInRow(): void {
    this.cardsInRow$ = this.itemsInRowService
      .getItemsInRow$({
        hostElem: this.hostElRef.nativeElement,
        elemWidth: this.getCardWidth(),
        gapSize: GAP_SIZE,
        minItems: 1,
        update$: this.mobileService.getMediaEvent(true).pipe(
          tap((mediaEvent: MediaEvent) => {
            this.isMobile = mediaEvent.isMobile;
          }),
          map(() => [null, this.getCardWidth(), null])
        ),
      })
      .pipe(
        tap((cardsInRow) => {
          this.cardsInRow = cardsInRow;
          this.cd.detectChanges();
        })
      );
  }

  ngAfterContentInit(): void {
    this.subs.push(

      this.mutationObservableService.getMutationObservable(this.cardsList.nativeElement, {
        characterData: false,
        attributes: false,
        subtree: false,
        childList: true,
        removedElements: true,
        outsideZone: true,
        bufferTime: 200
      }).subscribe(() => {
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
    return this.cardWidth || (!isMobile ? CARD_TYPE_WIDTH[type] : CARD_TYPE_WIDTH_MOBILE[type]);
  }

  public hasEnoughCards() {
    return (
      this.cardsInRow < this.cardsList.nativeElement.childElementCount && this.cardsList.nativeElement.childElementCount > 1
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

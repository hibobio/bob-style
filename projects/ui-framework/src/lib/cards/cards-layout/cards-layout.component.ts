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
  NgZone,
  ChangeDetectorRef,
  ContentChildren,
  QueryList,
  OnInit,
  AfterContentInit,
} from '@angular/core';
import { CardType } from '../cards.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { outsideZone } from '../../services/utils/rxjs.operators';
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
} from '../../services/utils/functional-utils';
import { ItemsInRowService } from '../../avatar/avatar-layout/items-in-row.service';

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
    private DOM: DOMhelpers,
    private utilsService: UtilsService,
    private mobileService: MobileService,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private itemsInRowService: ItemsInRowService
  ) {}

  @ContentChildren(BaseCardElement) public cards: QueryList<BaseCardElement>;

  @Input() alignCenter: boolean | 'auto' = false;
  @Input() mobileSwiper = false;
  @Input() type: CardType = CardType.regular;

  @Output() cardsAmountChanged: EventEmitter<number> = new EventEmitter<
    number
  >();

  public cardsInRow = 1;
  public cardsInRow$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  public isMobile = false;

  private subs: Subscription[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (notFirstChanges(changes, ['type'])) {
      this.setCssVars();
      this.updateCardsInRow(false);
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.setCssVars();
    this.updateCardsInRow();

    this.subs.push(
      this.utilsService
        .getResizeEvent()
        .pipe(
          outsideZone(this.zone),
          filter(() => {
            return this.cardsInRow !== this.calcCardsInRow();
          })
        )
        .subscribe(() => {
          this.zone.run(() => {
            this.updateCardsInRow();
          });
        }),

      this.mobileService
        .getMediaEvent()
        .pipe(outsideZone(this.zone))
        .subscribe((media: MediaEvent) => {
          this.isMobile = media.matchMobile;
          this.setCssVars();
          this.updateCardsInRow();
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
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    this.subs.length = 0;
  }

  getCardsInRow$(): Observable<number> {
    return this.cardsInRow$ as Observable<number>;
  }

  private updateCardsInRow(doCheck = true): void {
    this.cardsInRow = this.calcCardsInRow();
    this.cardsInRow$.next(this.cardsInRow);
    if (this.cardsAmountChanged.observers.length > 0) {
      this.cardsAmountChanged.emit(this.cardsInRow);
    }
    if (doCheck && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  private setCssVars(): void {
    this.DOM.setCssProps(this.hostRef.nativeElement, {
      '--card-width':
        (!this.isMobile
          ? CARD_TYPE_WIDTH[this.type]
          : CARD_TYPE_WIDTH_MOBILE[this.type]) + 'px',
      '--card-grid-gap': GAP_SIZE + 'px',
    });
  }

  private calcCardsInRow(): number {
    const cardWidth = !this.isMobile
      ? CARD_TYPE_WIDTH[this.type]
      : CARD_TYPE_WIDTH_MOBILE[this.type];

    return this.itemsInRowService.itemsInRow(
      this.hostRef.nativeElement,
      cardWidth,
      GAP_SIZE
    );
  }

  public hasEnoughCards() {
    return (
      this.cards && this.cardsInRow < this.cards.length && this.cards.length > 1
    );
  }

  public isSwiperEnabled() {
    return this.mobileSwiper && this.isMobile && this.hasEnoughCards();
  }

  public isAlignedCenter() {
    return (
      this.alignCenter === true ||
      (this.alignCenter === 'auto' && !this.hasEnoughCards())
    );
  }
}

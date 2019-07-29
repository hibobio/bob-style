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
  NgZone
} from '@angular/core';
import { CardType } from '../cards.enum';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { outsideZone } from '../../services/utils/rxjs.operators';

export const CARD_TYPE_WIDTH = {
  [CardType.small]: 160,
  [CardType.regular]: 190,
  [CardType.large]: 260
};

export const GAP_SIZE = 16;

@Component({
  selector: 'b-cards',
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsLayoutComponent
  implements AfterViewInit, OnDestroy, OnChanges {
  resizeSubscription: Subscription;

  private cardsInRow$: BehaviorSubject<number>;
  private cardsInRow: number;

  constructor(
    private hostRef: ElementRef,
    private domUtils: DOMhelpers,
    private utilsService: UtilsService,
    private zone: NgZone
  ) {}

  @Input() alignCenter = false;
  @Input() type: CardType = CardType.regular;
  @Output() cardsAmountChanged: EventEmitter<number> = new EventEmitter<
    number
  >();

  ngAfterViewInit(): void {
    this.setCssVars();
    this.cardsInRow = this.calcCardsInRow();
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type && !changes.type.firstChange) {
      this.type = changes.type.currentValue;
      this.setCssVars();
    }
  }

  private setCssVars(): void {
    this.domUtils.setCssProps(this.hostRef.nativeElement, {
      '--card-max-width': CARD_TYPE_WIDTH[this.type] + 'px',
      '--card-grid-gap': GAP_SIZE + 'px'
    });
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

  private calcCardsInRow(): number {
    const hostWidth = this.domUtils.getInnerWidth(this.hostRef.nativeElement);
    const gaps =
      (Math.floor(hostWidth / CARD_TYPE_WIDTH[this.type]) - 1) * GAP_SIZE;
    return Math.floor((hostWidth - gaps) / CARD_TYPE_WIDTH[this.type]);
  }
}

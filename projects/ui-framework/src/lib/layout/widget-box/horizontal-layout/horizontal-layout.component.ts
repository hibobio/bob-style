import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { ButtonSize, ButtonType } from '../../../buttons/buttons.enum';
import { CardsLayoutComponent } from '../../../cards/cards-layout/cards-layout.component';
import { CardType } from '../../../cards/cards.enum';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { ContentTemplateConsumer } from '../../../services/utils/contentTemplate.directive';

@Component({
  selector: 'b-horizontal-layout',
  templateUrl: 'horizontal-layout.component.html',
  styleUrls: ['./horizontal-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalLayoutComponent
  extends ContentTemplateConsumer
  implements OnDestroy {
  showAll: boolean;
  itemsPerRow: number;

  @Input() items: any[];
  @Input() cardWidth: number;
  @Input() swiper: boolean = false;
  @ViewChild(CardsLayoutComponent, { static: true })
  private cardsLayout: CardsLayoutComponent;

  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly cardType: CardType.small;
  private onDestroyNotifier$ = new Subject();

  constructor(
    private elRef: ElementRef<HTMLElement>,
    private DOM: DOMhelpers,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngAfterContentInit(): void {
    this.setItemsPerRow();
  }

  toggleShowAll(showAll: boolean): void {
    this.showAll = showAll;
    this.cdr.detectChanges();
  }

  private setItemsPerRow(): void {
    this.cardsLayout
      .getCardsInRow$()
      .pipe(takeUntil(this.onDestroyNotifier$))
      .subscribe((data) => {
        this.itemsPerRow = data;
        this.cdr.detectChanges();

        const cardsList = this.cardsLayout.hostElRef.nativeElement
          .firstElementChild as HTMLElement;
        const itemHeight = (cardsList.firstElementChild as HTMLElement)
          .offsetHeight;

        this.DOM.setCssProps(cardsList, {
          '--item-height': `${itemHeight}px`,
        });
      });
  }

  hasScroll(): boolean {
    return !!(this.showAll && this.items?.length > this.itemsPerRow * 2);
  }

  // public scroll(): void {// TODO: programmatically scrolling
  //   this.cards.nativeElement.scrollLeft += 100;
  // }

  ngOnDestroy(): void {
    this.onDestroyNotifier$.next();
  }
}

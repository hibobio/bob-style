import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  AfterContentInit,
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
import { Icons } from '../../../icons/icons.enum';

enum Direction {
  next = 1,
  prev = -1,
}

@Component({
  selector: 'b-horizontal-layout',
  templateUrl: 'horizontal-layout.component.html',
  styleUrls: ['./horizontal-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalLayoutComponent
  extends ContentTemplateConsumer
  implements OnDestroy, AfterContentInit {
  showAll: boolean;
  itemsPerRow: number;
  showPrev: boolean;
  showNext: boolean;

  @Input() items: any[];
  @Input() cardWidth: number;
  @Input() swiper = false;

  @ViewChild(CardsLayoutComponent, { static: true })
  private cardsLayout: CardsLayoutComponent;
  @ViewChild('lastItem', { static: true })
  private lastItem: ElementRef<HTMLElement>;
  private cardsList: HTMLElement;
  private scrollLeftMax: number;
  private onDestroyNotifier$ = new Subject();
  
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize.large;
  readonly icons = Icons;
  readonly cardType: CardType.small;
  readonly direction = Direction;

  constructor(
    private elRef: ElementRef<HTMLElement>,
    private DOM: DOMhelpers,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngAfterContentInit(): void {
    this.setItemsPerRow();
    !this.hasLastItem && this.lastItem.nativeElement.remove();
  }

  toggleShowAll(showAll: boolean): void {
    this.showAll = showAll;
    this.cdr.detectChanges();
  }

  private get hasLastItem(): boolean {
    return !!this.lastItem.nativeElement.children.length;
  }

  private setItemsPerRow(): void {
    this.cardsLayout
      .getCardsInRow$()
      .pipe(takeUntil(this.onDestroyNotifier$))
      .subscribe((data) => {
        this.itemsPerRow = this.hasLastItem && data > 1  ? data - 1 : data;
        this.cdr.detectChanges();

        this.cardsList = this.cardsLayout.cardsList.nativeElement;
        this.scrollLeftMax = this.cardsList.scrollWidth - this.cardsList.clientWidth;
        this.showNext = this.scrollLeftMax > 0;
        const itemHeight = (this.cardsList.firstElementChild as HTMLElement).offsetHeight;

        this.DOM.setCssProps(this.cardsList, {
          '--item-height': `${itemHeight}px`,
        });
      });
  }

  hasVerticalScroll(): boolean {
    return !!(this.showAll && this.items?.length > this.itemsPerRow * 2);
  }

  public onScrollClick(dir: Direction): void {
    const cardWidth = this.cardWidth || 150;
    const cardsCountToScroll = 2;

    this.cardsList.scrollLeft += cardWidth * cardsCountToScroll * dir;
    this.showNext = this.cardsList.scrollLeft < this.scrollLeftMax;
    this.showPrev = this.cardsList.scrollLeft > 0;
  }

  ngOnDestroy(): void {
    this.onDestroyNotifier$.next();
  }
}

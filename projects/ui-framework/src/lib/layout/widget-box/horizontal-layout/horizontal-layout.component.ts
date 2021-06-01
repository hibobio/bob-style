import { ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ButtonType, ButtonSize } from '../../../buttons/buttons.enum';
import { ContentTemplateConsumer } from '../../../services/utils/contentTemplate.directive';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { filter, take, takeUntil } from 'rxjs/operators';
import { CardType } from '../../../cards/cards.enum';
import { CardsLayoutComponent } from '../../../cards/cards-layout/cards-layout.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'b-horizontal-layout',
  templateUrl: 'horizontal-layout.component.html',
  styleUrls: ['./horizontal-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HorizontalLayoutComponent extends ContentTemplateConsumer implements OnDestroy {
  @Input() items: any[];
  showAll: boolean;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  itemsPerRow: number;
  readonly cardType: CardType.small;
  private onDestroyNotifier$ = new Subject();
  
  @ViewChild(CardsLayoutComponent, { read: ElementRef }) private cards: ElementRef;
  @ViewChild(CardsLayoutComponent, { static: true }) private cardsLayout: CardsLayoutComponent;
  @ViewChildren('listItem') private listItems: QueryList<ElementRef<HTMLElement>>;

  constructor(private elRef: ElementRef, private DOM: DOMhelpers, private cdr: ChangeDetectorRef) {
    super();
  }

  ngAfterContentInit(): void {
    this.setItemsPerRow();
  }

  ngAfterViewInit(): void {
    this.listItems.changes.pipe(
        filter((queryList) => queryList.first),
        take(1)
      )
      .subscribe((queryList) => {
        const itemHeight = queryList.first.nativeElement.offsetHeight;

        this.DOM.setCssProps(this.cards.nativeElement, {
          '--item-height': `${itemHeight}px`,
          '--container-max-height': `calc((${itemHeight}px + var(--item-grid-gap)) * 2)`
        });
      });
  }

  toggleShowAll(showAll: boolean): void {
    this.showAll = showAll;
    this.cdr.detectChanges();
  }

  private setItemsPerRow(): void {
    this.cardsLayout.getCardsInRow$()
    .pipe(takeUntil(this.onDestroyNotifier$))
    .subscribe(data => {
      this.itemsPerRow = data;
      this.cdr.detectChanges();
    })
  }

  hasScroll(): boolean {
    return !!(this.showAll && (this.items?.length > this.itemsPerRow * 2))
  }

  // public scroll(): void {// TODO: programmatically scrolling
  //   this.cards.nativeElement.scrollLeft += 100;
  // }

  ngOnDestroy(): void {
    this.onDestroyNotifier$.next();
  }

}

import { ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ButtonType, ButtonSize } from '../../../buttons/buttons.enum';
import { ContentTemplateConsumer } from '../../../services/utils/contentTemplate.directive';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { takeUntil } from 'rxjs/operators';
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
  
  @ViewChild(CardsLayoutComponent, { static: true }) private cardsLayout: CardsLayoutComponent;

  constructor(private elRef: ElementRef, private DOM: DOMhelpers, private cdr: ChangeDetectorRef) {
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
    this.cardsLayout.getCardsInRow$()
    .pipe(takeUntil(this.onDestroyNotifier$))
    .subscribe(data => {
      this.itemsPerRow = data;
      this.cdr.detectChanges();

      const itemHeight = this.cardsLayout.hostElRef.nativeElement.querySelector('div.cards-list > div').offsetHeight;

      this.DOM.setCssProps(this.cardsLayout.hostElRef.nativeElement, {
        '--item-height': `${itemHeight}px`,
        '--container-max-height': `calc((${itemHeight}px + var(--item-grid-gap)) * 2)`
      });
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

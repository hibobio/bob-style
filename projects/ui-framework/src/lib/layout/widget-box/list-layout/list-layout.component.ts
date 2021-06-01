import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { ButtonType, ButtonSize } from '../../../buttons/buttons.enum';
import { ContentTemplateConsumer } from '../../../services/utils/contentTemplate.directive';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'b-list-layout',
  templateUrl: 'list-layout.component.html',
  styleUrls: ['./list-layout.component.scss']
})

export class ListLayoutComponent extends ContentTemplateConsumer {
  @Input() items: any[];
  showAll: boolean;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly defaultNumOfItems = 3;
  readonly numberOfItemsBeforeScroll = 6;
  
  @ViewChildren("listItem") private listItems: QueryList<ElementRef<HTMLElement>>;

  constructor(private elRef: ElementRef, private DOM: DOMhelpers,) {
    super();
  }

  ngAfterViewInit(): void {
    this.listItems.changes.pipe(
        filter((queryList) => queryList.first),
        take(1)
      )
      .subscribe((queryList) => {
        const itemHeight = queryList.first.nativeElement.offsetHeight;
        this.DOM.setCssProps(this.elRef.nativeElement, {
          '--item-height': `${itemHeight}px`,
          '--container-max-height': `${itemHeight * this.numberOfItemsBeforeScroll}px`,
        });
      });
  }

  toggleShowAll(showAll: boolean): void {
    this.showAll = showAll;
  }

  hasScroll(): boolean {
    return !!(this.showAll && (this.items?.length > this.numberOfItemsBeforeScroll))
  }

}

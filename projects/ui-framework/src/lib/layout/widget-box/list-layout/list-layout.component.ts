import { Component, ElementRef, Input } from '@angular/core';
import { ButtonType, ButtonSize } from '../../../buttons/buttons.enum';
import { ContentTemplateConsumer } from '../../../services/utils/contentTemplate.directive';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';

const itemHeight = 70;

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

  constructor(private elRef: ElementRef, private DOM: DOMhelpers,) {
    super();
  }

  ngOnInit() { 
    this.setCssVars();
  }

  public isScroll(): boolean {
    return !!(this.showAll && (this.items.length > this.numberOfItemsBeforeScroll))
  }

  private setCssVars(): void {
    this.DOM.setCssProps(this.elRef.nativeElement, {
      '--item-height': `${itemHeight}px`,
      '--container-max-height': `${itemHeight * this.numberOfItemsBeforeScroll - 1}px`,
    });
  }
}

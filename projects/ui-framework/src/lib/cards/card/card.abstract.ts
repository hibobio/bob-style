import { Input, Output, EventEmitter, HostBinding, ElementRef, Directive } from '@angular/core';
import { Card } from './card.interface';
import { CardType } from '../cards.enum';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

@Directive()
export abstract class BaseCardElement {
  constructor(public cardElRef: ElementRef) {}

  @Input() card: Card;
  @Input() isClickable = false;
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();

  readonly cardType = CardType;
  readonly tooltipType = TruncateTooltipType;

  @HostBinding('attr.data-type') @Input() type: CardType = CardType.regular;
  @HostBinding('attr.role') role = 'listitem';
  @HostBinding('class.single-card') singleCard = true;
  @HostBinding('class.clickable') isClickableCard() {
    return this.isClickable || this.clicked.observers.length > 0;
  }
  @HostBinding('attr.tabindex') get tabindex() {
    return this.isClickableCard() ? '0' : '-1';
  }
}

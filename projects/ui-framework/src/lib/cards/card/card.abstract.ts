import {
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ElementRef
} from '@angular/core';
import { Card } from './card.interface';
import { CardType } from '../cards.enum';

export abstract class BaseCardElement {
  constructor(public cardElRef: ElementRef) {}

  @Input() card: Card;
  @Input() isClickable = false;
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();

  readonly cardType = CardType;

  @HostBinding('attr.data-type') @Input() type: CardType = CardType.regular;
  @HostBinding('class.single-card') isSingleCard() {
    return true;
  }
  @HostBinding('class.clickable') isClickableCard() {
    return this.isClickable || this.clicked.observers.length > 0;
  }
  @HostBinding('attr.tabindex') get tabindex() {
    return this.isClickableCard() ? '0' : '-1';
  }
}

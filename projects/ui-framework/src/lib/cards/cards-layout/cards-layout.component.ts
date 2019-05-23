import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CardData, AddCardData, CardClickEvent } from '../cards.interface';
import { CardType } from '../cards.enum';

@Component({
  selector: 'b-cards',
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss']
})
export class CardsLayoutComponent {
  constructor() {}

  @Input() cards: CardData[];
  @Input() addCard: AddCardData;
  @Input() type: CardType = CardType.primary;

  @Output() cardClicked: EventEmitter<CardClickEvent> = new EventEmitter<
    CardClickEvent
  >();

  onCardClicked(card: CardData, index: number): void {
    this.cardClicked.emit({
      card,
      cardIndex: index
    });
  }
}

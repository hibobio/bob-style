import { Component, Input } from '@angular/core';
import { CardType } from '../cards.enum';

@Component({
  selector: 'b-cards',
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss']
})
export class CardsLayoutComponent {
  constructor() {}

  @Input() type: CardType = CardType.primary;

}

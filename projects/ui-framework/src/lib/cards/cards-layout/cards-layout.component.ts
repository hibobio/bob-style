import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CardType } from '../cards.enum';

@Component({
  selector: 'b-cards',
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsLayoutComponent {
  constructor() {}

  @Input() type: CardType = CardType.regular;

}

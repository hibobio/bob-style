import {
  Component,
  Input,
  Output,
  HostBinding,
  HostListener,
  EventEmitter
} from '@angular/core';
import { AddCardData } from '../cards.interface';
import { CardType } from '../cards.enum';

@Component({
  selector: 'b-card-add, [b-card-add]',
  templateUrl: './card-add.component.html',
  styleUrls: ['../card/card.component.scss', './card-add.component.scss']
})
export class CardAddComponent {
  constructor() {}

  cardType = CardType;

  @Input() card: AddCardData;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('attr.tabindex') string = '0';

  @HostBinding('attr.data-type') @Input() type: CardType = CardType.regular;

  @HostListener('click', ['$event'])
  onClick($event) {
    this.clicked.emit($event);
  }
}

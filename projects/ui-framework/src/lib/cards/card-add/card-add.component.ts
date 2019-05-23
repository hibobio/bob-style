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

  @Input() card: AddCardData;
  @Input() type: CardType = CardType.primary;

  cardType = CardType;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('attr.tabindex') string = '0';

  @HostBinding('class')
  get typeClass() {
    return 'card-' + this.type;
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    this.clicked.emit($event);
  }
}

import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { CardType } from '../cards.enum';
import { AddCard } from './card-add.interface';

@Component({
  selector: 'b-card-add, [b-card-add]',
  templateUrl: './card-add.component.html',
  styleUrls: ['../card/card.component.scss', './card-add.component.scss']
})
export class CardAddComponent {
  @Input() card: AddCard;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('attr.tabindex') string = '0';
  @HostBinding('attr.data-type') @Input() type: CardType = CardType.regular;

  readonly cardType = CardType;

  @HostListener('click', ['$event'])
  onClick($event) {
    this.clicked.emit($event);
  }
}

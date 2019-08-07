import {
  Component,
  HostBinding,
  HostListener,
  Input,
  ElementRef
} from '@angular/core';
import { CardType } from '../cards.enum';
import { AddCard } from './card-add.interface';
import { BaseCardElement } from '../card/card.abstract';

@Component({
  selector: 'b-card-add, [b-card-add]',
  templateUrl: './card-add.component.html',
  styleUrls: ['../card/card.component.scss', './card-add.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardAddComponent }]
})
export class CardAddComponent extends BaseCardElement {
  constructor(public cardElRef: ElementRef) {
    super(cardElRef);
  }
  @Input() card: AddCard;

  @HostBinding('attr.tabindex') string = '0';

  readonly cardType = CardType;

  @HostListener('click', ['$event'])
  onClick($event) {
    this.clicked.emit($event);
  }
}

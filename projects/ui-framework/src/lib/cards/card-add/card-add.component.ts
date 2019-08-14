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
  styleUrls: ['./card-add.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardAddComponent }]
})
export class CardAddComponent extends BaseCardElement {
  constructor(public cardElRef: ElementRef) {
    super(cardElRef);
  }

  readonly cardType = CardType;

  @Input() card: AddCard;

  @HostBinding('attr.tabindex') string = '0';

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    this.clicked.emit($event);
  }
}

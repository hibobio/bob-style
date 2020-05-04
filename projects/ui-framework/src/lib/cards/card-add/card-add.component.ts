import {
  Component,
  HostBinding,
  HostListener,
  Input,
  ElementRef,
} from '@angular/core';
import { AddCard } from './card-add.interface';
import { BaseCardElement } from '../card/card.abstract';
import { isFunction } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-card-add, [b-card-add]',
  templateUrl: './card-add.component.html',
  styleUrls: ['./card-add.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardAddComponent }],
})
export class CardAddComponent extends BaseCardElement {
  constructor(public cardElRef: ElementRef) {
    super(cardElRef);
  }

  @Input() card: AddCard;

  @HostBinding('attr.tabindex') tabindx = '0';

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    if (isFunction(this.card.action)) {
      this.card.action();
    }
    if (this.clicked.observers.length) {
      this.clicked.emit($event);
    }
  }
}

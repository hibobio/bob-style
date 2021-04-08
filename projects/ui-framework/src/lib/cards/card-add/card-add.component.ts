import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';

import { isFunction } from '../../services/utils/functional-utils';
import { BaseCardElement } from '../card/card.abstract';
import { AddCard } from './card-add.interface';

@Component({
  selector: 'b-card-add, [b-card-add]',
  templateUrl: './card-add.component.html',
  styleUrls: ['./card-add.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardAddComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

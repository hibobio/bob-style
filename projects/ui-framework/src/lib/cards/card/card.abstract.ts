import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import {
  applyChanges,
  isFunction,
} from '../../services/utils/functional-utils';
import { CardType } from '../cards.enum';
import { Card } from './card.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseCardElement implements OnChanges {
  constructor(public cardElRef: ElementRef) {}

  @Input() card: Card;
  @Input() isClickable = false;
  @Output() clicked: EventEmitter<any> = new EventEmitter();

  readonly cardType = CardType;
  readonly tooltipType = TruncateTooltipType;

  @HostBinding('attr.data-type') @Input() type: CardType = CardType.regular;
  @HostBinding('attr.role') role = 'listitem';
  @HostBinding('class.single-card') singleCard = true;
  @HostBinding('class.clickable') get clickable() {
    return this.isClickableCard();
  }
  @HostBinding('attr.tabindex') get tabindex() {
    return this.isClickableCard() ? '0' : '-1';
  }

  public isClickableCard() {
    return (
      this.isClickable ||
      this.clicked.observers.length > 0 ||
      isFunction(this.card['action'])
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        type: CardType.regular,
        card: {},
      },
      [],
      true
    );
  }
}

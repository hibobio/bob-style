import {
  ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges,
} from '@angular/core';
import { CardType } from '../cards.enum';
import { IconColor, Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { Card } from './card.interface';
import { has } from 'lodash';
import { LinkColor } from '../../buttons-indicators/link/link.enum';

@Component({
  selector: 'b-card, [b-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnChanges {
  constructor() {
  }

  @Input() card: Card;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly linkColor = LinkColor;

  @HostBinding('attr.data-focus-inside') menuIsOpened: boolean;
  @HostBinding('attr.data-type') @Input() type: CardType = CardType.regular;

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'card')) {
      this.card = changes.card.currentValue;
    }
  }

  onMenuOpen(): void {
    this.menuIsOpened = true;
  }

  onMenuClose(): void {
    setTimeout(() => {
      this.menuIsOpened = false;
    }, 150);
  }

  onCtaClick(event): void {
    this.clicked.emit(event);
  }
}

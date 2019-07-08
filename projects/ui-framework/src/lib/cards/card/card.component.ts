import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { CardData } from '../cards.interface';
import { CardType } from '../cards.enum';
import { RenderedComponent } from '../../services/component-renderer/component-renderer.interface';
import { Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';

import { isRenderedComponent, isString } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-card, [b-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  constructor() {}

  @Input() card: CardData;
  @Input() type: CardType = CardType.primary;
  @Input() index: number;
  @Input() clickable = false;

  cardType = CardType;
  button = ButtonType;
  icons = Icons;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('class.focus-inside') menuIsOpened: boolean;

  @HostBinding('class')
  get typeClass() {
    return 'card-' + this.type + (this.clickable ? ' clickable' : '');
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    this.clicked.emit($event);
  }

  onMenuOpen(): void {
    this.menuIsOpened = true;
  }

  onMenuClose(): void {
    setTimeout(() => {
      this.menuIsOpened = false;
    }, 150);
  }

  stopPropagation($event): void {
    $event.stopPropagation();
  }
}

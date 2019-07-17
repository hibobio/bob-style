import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { CardData } from '../cards.interface';
import { CardType } from '../cards.enum';
import { Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';

@Component({
  selector: 'b-card, [b-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  constructor() {}

  @Input() card: CardData;

  cardType = CardType;
  button = ButtonType;
  icons = Icons;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('attr.data-focus-inside') menuIsOpened: boolean;
  @HostBinding('attr.data-type') @Input() type: CardType = CardType.regular;
  @HostBinding('attr.data-clickable') @Input() clickable = false;
  @HostBinding('attr.tabindex') get tabindex() {
    return this.clickable ? '0' : '-1';
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
}

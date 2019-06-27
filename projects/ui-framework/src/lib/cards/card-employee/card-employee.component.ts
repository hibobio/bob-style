import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { CardData } from '../cards.interface';
import { CardType } from '../cards.enum';
import {
  AvatarSize,
  AvatarOrientation
} from '../../buttons-indicators/avatar/avatar.enum';

@Component({
  selector: 'b-card-employee, [b-card-employee]',
  templateUrl: './card-employee.component.html',
  styleUrls: ['../card/card.component.scss', './card-employee.component.scss']
})
export class EmployeeCardComponent {
  constructor() {}

  @Input() card: CardData;
  @Input() type: CardType = CardType.primary;
  @Input() index: number;
  @Input() clickable = false;

  cardType = CardType;
  avatarSize = AvatarSize;
  avatarOrientation = AvatarOrientation;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('class')
  get typeClass() {
    return 'card-' + this.type + (this.clickable ? ' clickable' : '');
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    this.clicked.emit($event);
  }
}

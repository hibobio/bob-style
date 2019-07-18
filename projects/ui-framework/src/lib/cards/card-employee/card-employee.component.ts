import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { CardEmployee } from '../cards.interface';
import { CardType } from '../cards.enum';
import {
  AvatarOrientation,
  AvatarSize
} from '../../buttons-indicators/avatar/avatar.enum';

@Component({
  selector: 'b-card-employee, [b-card-employee]',
  templateUrl: './card-employee.component.html',
  styleUrls: ['../card/card.component.scss', './card-employee.component.scss']
})
export class EmployeeCardComponent {
  constructor() {}

  @Input() card: CardEmployee;
  @Input() type: CardType = CardType.regular;
  @Input() clickable = false;

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

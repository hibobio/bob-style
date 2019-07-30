import {
  Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges,
} from '@angular/core';
import { CardType } from '../cards.enum';
import { AvatarSize } from '../../buttons-indicators/avatar/avatar.enum';
import { CardEmployee } from './card-employee.interface';
import { has } from 'lodash';

@Component({
  selector: 'b-card-employee, [b-card-employee]',
  templateUrl: './card-employee.component.html',
  styleUrls: ['../card/card.component.scss', './card-employee.component.scss']
})
export class CardEmployeeComponent implements OnChanges {
  constructor(
    private elRef: ElementRef,
  ) {
  }

  @Input() card: CardEmployee;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  readonly avatarSize = AvatarSize;
  readonly cardType = CardType;

  @HostBinding('attr.data-type') @Input() type: CardType = CardType.regular;

  onClick($event) {
    this.clicked.emit($event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'card.currentValue.coverColors')) {
      this.card = changes.card.currentValue;
      this.elRef.nativeElement.style
        .setProperty('--background-color-1', `${ this.card.coverColors.color1 }`);
      this.elRef.nativeElement.style
        .setProperty('--background-color-2', `${ this.card.coverColors.color2 }`);
    }
  }
}

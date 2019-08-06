import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { AvatarSize } from '../../buttons-indicators/avatar/avatar.enum';
import { CardEmployee } from './card-employee.interface';
import { has } from 'lodash';
import { BaseCardElement } from '../card/card.abstract';

@Component({
  selector: 'b-card-employee, [b-card-employee]',
  templateUrl: './card-employee.component.html',
  styleUrls: ['../card/card.component.scss', './card-employee.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardEmployeeComponent }]
})
export class CardEmployeeComponent extends BaseCardElement
  implements OnChanges {
  constructor(public cardElRef: ElementRef) {
    super(cardElRef);
  }

  @Input() card: CardEmployee;

  readonly avatarSize = AvatarSize;

  onClick($event) {
    this.clicked.emit($event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'card.currentValue.coverColors')) {
      this.card = changes.card.currentValue;
      this.cardElRef.nativeElement.style.setProperty(
        '--background-color-1',
        `${this.card.coverColors.color1}`
      );
      this.cardElRef.nativeElement.style.setProperty(
        '--background-color-2',
        `${this.card.coverColors.color2}`
      );
    }
  }
}

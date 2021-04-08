import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

import { isFunction, percentage } from '../../services/utils/functional-utils';
import { BaseCardElement } from '../card/card.abstract';
import { ImageCard } from './card-image.interface';

@Component({
  selector: 'b-card-image, [b-card-image]',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardImageComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardImageComponent extends BaseCardElement {
  constructor(public cardElRef: ElementRef) {
    super(cardElRef);
  }

  @Input() card: ImageCard;

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    if (isFunction(this.card.action)) {
      this.card.action();
    }
    if (this.clicked.observers.length) {
      this.clicked.emit($event);
    }
  }

  getRatio(ratio = 1.5): number {
    return percentage(1 / ratio);
  }
}

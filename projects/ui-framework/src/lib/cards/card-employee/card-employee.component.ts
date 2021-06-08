import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { DOMMouseEvent } from '../../types';
import { BaseCardElement } from '../card/card.abstract';
import { CardEmployee } from './card-employee.interface';

@Component({
  selector: 'b-card-employee, [b-card-employee]',
  templateUrl: './card-employee.component.html',
  styleUrls: ['./card-employee.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardEmployeeComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardEmployeeComponent
  extends BaseCardElement
  implements OnChanges, AfterViewInit {
  constructor(
    public cardElRef: ElementRef<HTMLElement>,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private DOM: DOMhelpers
  ) {
    super(cardElRef);
  }

  @ViewChild('cardContent') cardContent: ElementRef<HTMLElement>;
  @ViewChild('cardBottom') cardBottom: ElementRef<HTMLElement>;

  readonly avatarSize = AvatarSize;
  public hasContent = true;
  public hasBottom = true;

  @Input() card: CardEmployee;

  onClick($event: DOMMouseEvent) {
    this.clicked.emit($event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.card && !changes.card.firstChange) {
      this.card = changes.card.currentValue;
      this.setCssVars();
    }
  }

  ngAfterViewInit(): void {
    this.setCssVars();

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasContent = !this.DOM.isEmpty(this.cardContent.nativeElement);
        this.hasBottom = !this.DOM.isEmpty(this.cardBottom.nativeElement);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  private setCssVars(): void {
    if (this.card.coverColors) {
      this.DOM.setCssProps(this.cardElRef.nativeElement, {
        '--background-color-1': this.card.coverColors.color1,
        '--background-color-2': this.card.coverColors.color2,
      });
    }
  }
}

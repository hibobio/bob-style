import {
  Component,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { IconColor, Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons/buttons.enum';
import { LinkColor } from '../../indicators/link/link.enum';
import { BaseCardElement } from './card.abstract';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@Component({
  selector: 'b-card, [b-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardComponent }],
})
export class CardComponent extends BaseCardElement implements AfterViewInit {
  constructor(
    public cardElRef: ElementRef,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private DOM: DOMhelpers
  ) {
    super(cardElRef);
  }

  @ViewChild('cardTop') cardTop: ElementRef;
  @ViewChild('cardContent') cardContent: ElementRef;

  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly linkColor = LinkColor;
  public hasContent = true;
  public hasTop = true;
  public cardTopTextOnly = false;

  public titleMaxLines = 2;

  onCtaClick(event: MouseEvent): void {
    this.clicked.emit(event);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasContent = !this.DOM.isEmpty(this.cardContent.nativeElement);
        this.hasTop = !this.DOM.isEmpty(this.cardTop.nativeElement);

        this.cardTopTextOnly =
          this.cardTop.nativeElement.children.length === 1 &&
          this.cardTop.nativeElement.children[0].children.length === 0;

        this.titleMaxLines = this.getTitleMaxLines();

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  private getTitleMaxLines() {
    return this.hasContent ? 2 : this.card.imageUrl ? 3 : this.hasTop ? 4 : 6;
  }
}

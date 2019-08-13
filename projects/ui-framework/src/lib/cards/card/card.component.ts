import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { IconColor, Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { LinkColor } from '../../buttons-indicators/link/link.enum';
import { BaseCardElement } from './card.abstract';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

@Component({
  selector: 'b-card, [b-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardComponent }]
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

  @ViewChild('cardTop', { static: false }) cardTop: ElementRef;
  @ViewChild('cardContent', { static: false }) cardContent: ElementRef;

  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly linkColor = LinkColor;
  public hasContent = true;
  public hasTop = true;

  @HostBinding('attr.data-focus-inside') menuIsOpened: boolean;

  onMenuOpen(): void {
    this.menuIsOpened = true;
  }

  onMenuClose(): void {
    setTimeout(() => {
      this.menuIsOpened = false;
    }, 150);
  }

  onCtaClick(event: MouseEvent): void {
    this.clicked.emit(event);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasContent = !this.DOM.isEmpty(this.cardContent.nativeElement);
        this.hasTop = !this.DOM.isEmpty(this.cardTop.nativeElement);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }
}

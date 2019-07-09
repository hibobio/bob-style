import {
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewContainerRef,
  DoCheck,
  NgZone,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { DOMhelpers, TextProps } from '../utils/dom-helpers.service';
import { TruncateTooltiptype } from './truncate-tooltip.enum';
import { debounce } from 'lodash';

@Component({
  selector: 'b-truncate-tooltip, [b-truncate-tooltip]',
  template: `
    <i
      *ngIf="type === types.material && tooltipAllowed && tooltipEnabled"
      class="tooltip-trigger"
      [matTooltip]="tooltipText"
      [matTooltipShowDelay]="delay"
      matTooltipPosition="above"
      matTooltipClass="b-truncate-tooltip"
    ></i>
    <i
      *ngIf="type === types.css && tooltipEnabled"
      class="tooltip-trigger"
      [attr.data-tooltip]="tooltipText"
    ></i>
    <div
      #textContainer
      class="btt"
      [ngClass]="{
        initialized: initialized,
        'tooltip-enabled': tooltipEnabled
      }"
      data-max-lines="1"
    >
      <ng-content></ng-content>
      <ng-template #directiveTemplate></ng-template>
    </div>
  `,
  styleUrls: ['./truncate-tooltip.component.scss']
})
export class TruncateTooltipComponent
  implements AfterViewInit, DoCheck, OnInit, OnDestroy {
  constructor(
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @Input('maxLines')
  set lines(value: number | string) {
    this.setMaxLines(value);
  }
  @Input('b-truncate-tooltip')
  set linesAlt(value: number | string) {
    this.setMaxLines(value);
  }

  @ViewChild('textContainer', { static: true }) textContainer: ElementRef;
  @ViewChild('directiveTemplate', { read: ViewContainerRef, static: true })
  child: ViewContainerRef;
  @Input() delay = 300;
  @Input() lazyness = 200;
  @Input() expectChanges = false;
  @Input() trustCssVars = false;
  @Input() type: TruncateTooltiptype = TruncateTooltiptype.auto;

  private textElementTextProps: TextProps;
  private maxLinesDefault = 1;
  private maxLinesCache = this.maxLinesDefault;
  private hoverTimer;
  public maxLines = this.maxLinesDefault;
  public tooltipText: string;
  public tooltipEnabled = false;
  public tooltipAllowed = false;
  public initialized = this.trustCssVars;
  readonly types = TruncateTooltiptype;

  ngOnInit(): void {
    if (this.lazyness !== 0 && this.type !== TruncateTooltiptype.css) {
      this.textContainer.nativeElement.addEventListener(
        'mouseenter',
        this.startHoverTimer
      );
      this.textContainer.nativeElement.addEventListener(
        'mouseleave',
        this.stopHoverTimer
      );
    }
    this.zone.runOutsideAngular(() => {
      window.addEventListener('resize', this.onWindowResize);
    });
  }

  ngAfterViewInit(): void {
    this.maxLinesCache = this.maxLines;

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.tooltipText = this.textContainer.nativeElement.textContent.trim();

        this.setCssVars();
        this.setMaxLinesAttr();
        this.checkTooltipNecessity();

        this.initialized = true;
        if (this.type === TruncateTooltiptype.css || this.lazyness === 0) {
          this.tooltipAllowed = true;
          this.stopHoverTimer();
          this.removeMouseListeners();
        }

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  ngDoCheck(): void {
    if (this.expectChanges) {
      if (
        this.initialized &&
        this.tooltipText !== this.textContainer.nativeElement.textContent.trim()
      ) {
        this.tooltipText = this.textContainer.nativeElement.textContent.trim();
        this.checkTooltipNecessity();
      }

      if (this.initialized && this.maxLines !== this.maxLinesCache) {
        this.setMaxLines(this.maxLines);
      }
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize);
    this.stopHoverTimer();
  }

  private setMaxLinesAttr(): void {
    if (this.textContainer) {
      this.textContainer.nativeElement.dataset.maxLines = this.maxLines;
    }
  }

  private setMaxHeight(): void {
    if (!this.trustCssVars) {
      this.textElementTextProps.maxHeight =
        this.textElementTextProps.fontSize *
        this.textElementTextProps.lineHeight *
        this.maxLines;
      this.DOM.setCssProps(this.textContainer.nativeElement, {
        'max-height': this.textElementTextProps.maxHeight + 'px'
      });
    }
  }

  private setCssVars(): void {
    if (!this.textElementTextProps && !this.trustCssVars) {
      this.textElementTextProps = this.DOM.getElementTextProps(
        this.DOM.getDeepTextElement(this.textContainer.nativeElement)
      );
      this.textElementTextProps.maxHeight =
        this.textElementTextProps.fontSize *
        this.textElementTextProps.lineHeight *
        this.maxLines;

      this.DOM.setCssProps(this.textContainer.nativeElement, {
        '--line-height': this.textElementTextProps.lineHeight,
        '--font-size': this.textElementTextProps.fontSize + 'px'
      });
      this.setMaxHeight();
    }
  }

  private checkTooltipNecessity(): void {
    if (this.type === TruncateTooltiptype.auto) {
      this.type =
        this.tooltipText.length > 130
          ? TruncateTooltiptype.material
          : TruncateTooltiptype.css;
    }

    const compareHeight = this.trustCssVars
      ? this.textContainer.nativeElement.offsetHeight + 5
      : this.textElementTextProps.maxHeight;

    this.tooltipEnabled =
      (this.maxLines === 1 &&
        this.textContainer.nativeElement.scrollWidth >
          this.textContainer.nativeElement.offsetWidth) ||
      (this.maxLines > 1 &&
        (this.textContainer.nativeElement.scrollHeight > compareHeight ||
          (this.textContainer.nativeElement.children[0] &&
            (this.textContainer.nativeElement.children[0] as HTMLElement)
              .offsetHeight)))
        ? true
        : false;
  }

  private parseMaxLines(value: string | number): number {
    value = parseInt(value as string, 10);
    return value === value ? value : this.maxLinesDefault;
  }

  private setMaxLines(value: number | string): void {
    this.maxLines = this.parseMaxLines(value);

    if (
      this.maxLines !== this.maxLinesCache &&
      this.initialized &&
      this.expectChanges
    ) {
      this.setMaxHeight();
      this.setMaxLinesAttr();
      this.checkTooltipNecessity();
    }
    this.maxLinesCache = this.maxLines;
  }

  // tslint:disable-next-line: member-ordering
  private onWindowResize = debounce(() => {
    this.checkTooltipNecessity();
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }, 1000);

  private startHoverTimer = () => {
    if (!this.hoverTimer) {
      this.hoverTimer = setTimeout(() => {
        this.removeMouseListeners();
        this.tooltipAllowed = true;
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, this.lazyness);
    }
  }

  private stopHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  private removeMouseListeners() {
    this.textContainer.nativeElement.removeEventListener(
      'mouseenter',
      this.startHoverTimer
    );
    this.textContainer.nativeElement.removeEventListener(
      'mouseleave',
      this.stopHoverTimer
    );
  }
}

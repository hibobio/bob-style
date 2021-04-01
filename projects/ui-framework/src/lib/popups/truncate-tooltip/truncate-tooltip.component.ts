import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { TextProps } from '../../services/html/html-helpers.interface';
import {
  asArray,
  hasChanges,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { MutationObservableService } from '../../services/utils/mutation-observable';
import { TooltipClass, TooltipPosition } from '../tooltip/tooltip.enum';
import { TruncateTooltipType } from './truncate-tooltip.enum';

@Component({
  selector: 'b-truncate-tooltip, [b-truncate-tooltip]',
  templateUrl: './truncate-tooltip.component.html',
  styleUrls: ['./truncate-tooltip.component.scss'],
})
export class TruncateTooltipComponent
  implements OnChanges, AfterViewInit, OnInit, OnDestroy {
  constructor(
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private mutationObservableService: MutationObservableService
  ) {}

  @Input() text: string;

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

  @Input() expectChanges = false;
  @Input() trustCssVars = false;
  @Input() type: TruncateTooltipType = TruncateTooltipType.auto;
  @Input() position: TooltipPosition = TooltipPosition.above;

  @Input() tooltipClass: TooltipClass | string | (TooltipClass | string)[];

  public delay = 300;
  public lazyness = 200;

  private textElementTextProps: TextProps;
  private maxLinesDefault = 1;
  private maxLinesCache = this.maxLinesDefault;
  private hoverTimer;

  public maxLines = this.maxLinesDefault;
  public tooltipText: string;
  public tooltipEnabled = false;
  public tooltipAllowed = false;
  public initialized = this.trustCssVars;

  readonly types = TruncateTooltipType;
  private readonly subs: Subscription[] = [];

  private checker$: Subject<any> = new Subject().pipe(
    debounceTime(100)
  ) as Subject<any>;

  @HostListener('click.outside-zone')
  onClick() {
    if (
      !this.text &&
      this.type === TruncateTooltipType.css &&
      !this.tooltipEnabled
    ) {
      this.checker$.next();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      hasChanges(changes, ['text'], true, {
        truthyCheck: (v: unknown) => v !== undefined,
        checkEquality: true,
      })
    ) {
      this.expectChanges = false;
      this.tooltipText = this.text;
      this.checker$.next();
    }
  }

  ngOnInit(): void {
    this.tooltipClass = asArray<string>(this.tooltipClass || []).concat(
      'b-truncate-tooltip'
    );

    this.subs.push(
      this.checker$.subscribe(() => {
        this.DOM.mutate(() => {
          if (this.checkTooltipNecessity() && !this.cd['destroyed']) {
            this.cd.detectChanges();
          }
        });
      })
    );

    if (this.type !== TruncateTooltipType.none) {
      //
      if (this.lazyness !== 0 && this.type !== TruncateTooltipType.css) {
        this.addMouseListeners();
      }

      this.zone.runOutsideAngular(() => {
        this.subs.push(
          this.mutationObservableService
            .getResizeObservervable(this.textContainer.nativeElement, {
              watch: 'width',
              threshold: 15,
              outsideZone: true,
              debounceTime: true,
            })
            .subscribe(this.checker$),

          !this.text &&
            this.expectChanges &&
            this.mutationObservableService
              .getMutationObservable(this.textContainer.nativeElement, {
                attributes: false,
                childList: true,
                characterData: true,
                subtree: true,
                outsideZone: true,
                bufferTime: true,
              })
              .subscribe(() => {
                this.doCheck();
              })
        );
      });
    }
  }

  ngAfterViewInit(): void {
    this.maxLinesCache = this.maxLines;

    this.zone.runOutsideAngular(() => {
      this.DOM.mutate(() => {
        this.tooltipText =
          this.text || this.textContainer.nativeElement.textContent.trim();

        this.setCssVars();
        this.setMaxLinesAttr();

        if (this.type !== TruncateTooltipType.none) {
          this.initialized = true;

          if (this.type === TruncateTooltipType.css || this.lazyness === 0) {
            this.tooltipAllowed = true;
            this.stopHoverTimer();
            this.removeMouseListeners();
          }

          if (!this.cd['destroyed']) {
            this.cd.detectChanges();
          }

          this.checker$.next();
        }
      });
    });
  }

  doCheck(): void {
    if (
      !this.text &&
      this.expectChanges &&
      this.type !== TruncateTooltipType.none
    ) {
      this.DOM.mutate(() => {
        if (this.initialized && this.maxLines !== this.maxLinesCache) {
          this.setMaxLines(this.maxLines);
        }
        if (
          this.initialized &&
          this.tooltipText !==
            this.textContainer.nativeElement.textContent.trim()
        ) {
          this.tooltipText = this.textContainer.nativeElement.textContent.trim();
          this.checker$.next();
        }
      });
    }
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);
    this.stopHoverTimer();
  }

  private setMaxLinesAttr(): void {
    if (this.textContainer) {
      this.textContainer.nativeElement.dataset.maxLines = this.maxLines;
    }
  }

  private setMaxHeight(): void {
    if (!this.trustCssVars) {
      this.textElementTextProps.maxHeight = Math.floor(
        this.textElementTextProps.fontSize *
          this.textElementTextProps.lineHeight *
          this.maxLines
      );
      this.DOM.setCssProps(this.textContainer.nativeElement, {
        'max-height':
          this.textElementTextProps.maxHeight > 0
            ? this.textElementTextProps.maxHeight + 'px'
            : null,
      });
    }
  }

  private setCssVars(): void {
    if (!this.textElementTextProps && !this.trustCssVars) {
      this.textElementTextProps = this.DOM.getElementTextProps(
        this.DOM.getDeepTextElement(this.textContainer.nativeElement)
      );
      this.DOM.setCssProps(this.textContainer.nativeElement, {
        '--line-height': this.textElementTextProps.lineHeight,
        '--font-size': this.textElementTextProps.fontSize + 'px',
      });
      this.setMaxHeight();
    }
  }

  private checkTooltipNecessity(): boolean {
    const prevTooltipEnabled = this.tooltipEnabled;
    const prevType = this.type;
    if (
      this.tooltipText &&
      (!this.type ||
        this.type === TruncateTooltipType.auto ||
        (this.type === TruncateTooltipType.css && this.expectChanges))
    ) {
      this.type =
        this.tooltipText.length > 130
          ? TruncateTooltipType.material
          : TruncateTooltipType.css;
    }

    const compareHeight = this.trustCssVars
      ? this.textContainer.nativeElement.offsetHeight + 5
      : this.textElementTextProps?.maxHeight;

    this.tooltipEnabled =
      (this.maxLines === 1 &&
        this.textContainer.nativeElement.scrollWidth >
          this.textContainer.nativeElement.offsetWidth) ||
      (this.maxLines > 1 &&
        (this.textContainer.nativeElement.scrollHeight > compareHeight ||
          (this.textContainer.nativeElement.children[0] &&
            (this.textContainer.nativeElement.children[0] as HTMLElement)
              .scrollHeight > compareHeight)))
        ? true
        : false;

    return prevTooltipEnabled !== this.tooltipEnabled || prevType !== this.type;
  }

  private parseMaxLines(value: string | number): number {
    value = value === null ? 0 : parseInt(value as string, 10);
    return value === value ? value : this.maxLinesDefault;
  }

  private setMaxLines(value: number | string): void {
    this.maxLines = this.parseMaxLines(value);

    if (this.maxLines !== this.maxLinesCache && this.initialized) {
      this.setMaxHeight();
      this.setMaxLinesAttr();
      this.checker$.next();
    }
    this.maxLinesCache = this.maxLines;
  }

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
  };

  private stopHoverTimer = () => {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  };

  private addMouseListeners() {
    this.textContainer.nativeElement.addEventListener(
      'mouseenter',
      this.startHoverTimer,
      {
        passive: true,
      }
    );
    this.textContainer.nativeElement.addEventListener(
      'mouseleave',
      this.stopHoverTimer,
      {
        passive: true,
      }
    );
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

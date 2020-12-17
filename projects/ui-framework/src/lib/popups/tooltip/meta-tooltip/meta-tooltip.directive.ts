import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import {
  Overlay,
  ScrollDispatcher,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import {
  MatTooltip,
  MatTooltipDefaultOptions,
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_SCROLL_STRATEGY,
} from '@angular/material/tooltip';
import { isObject, isString } from '../../../services/utils/functional-utils';
import { InfoTooltip } from '../../info-tooltip/info-tooltip.interface';

@Directive({
  selector: '[bTooltip]',
})
export class MetaTooltipDirective implements AfterViewInit, OnDestroy {
  constructor(
    private hostElRef: ElementRef<HTMLElement>,

    // used by mat tooltip
    @Inject(MAT_TOOLTIP_SCROLL_STRATEGY)
    private matTooltipScrollStrategy: ScrollStrategy,
    @Inject(MAT_TOOLTIP_DEFAULT_OPTIONS)
    private matTooltipDefaultOptions: MatTooltipDefaultOptions,
    private overlay: Overlay,
    private scrollDispatcher: ScrollDispatcher,
    private viewContainerRef: ViewContainerRef,
    private ngZone: NgZone,
    private platform: Platform,
    private ariaDescriber: AriaDescriber,
    private focusMonitor: FocusMonitor,
    private dir: Directionality
  ) {}

  @Input('bTooltip') tooltip: string | InfoTooltip;

  private matTooltip: MatTooltip;

  ngAfterViewInit(): void {
    if (isString(this.tooltip)) {
      this.attachMatTooltip(this.tooltip);
    }

    if (isObject(this.tooltip) && this.tooltip.text) {
    }
  }

  ngOnDestroy(): void {
    this.matTooltip?.ngOnDestroy();
  }

  private attachMatTooltip(tooltip: string): void {
    if (!this.matTooltip) {
      this.matTooltip = new MatTooltip(
        this.overlay,
        this.hostElRef,
        this.scrollDispatcher,
        this.viewContainerRef,
        this.ngZone,
        this.platform,
        this.ariaDescriber,
        this.focusMonitor,
        this.matTooltipScrollStrategy,
        this.dir,
        this.matTooltipDefaultOptions
      );
    }
    this.matTooltip.message = tooltip;
    this.matTooltip.ngAfterViewInit();
  }
}

import { Subscription } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';

import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  applyChanges,
  notFirstChanges,
  numberMinMax,
  randomNumber,
  simpleUID,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { MutationObservableService } from '../../services/utils/mutation-observable';
import { valueAsNumber } from '../../services/utils/transformers';
import { DOMMouseEvent } from '../../types';
import { ProgressSize } from '../progress/progress.enum';
import { ProgressConfig } from '../progress/progress.interface';
import { SimpleBarChartItem } from './simple-bar-chart.interface';

@Component({
  selector: 'b-simple-bar-chart',
  templateUrl: './simple-bar-chart.component.html',
  styleUrls: ['./simple-bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleBarChartComponent
  implements OnChanges, AfterViewInit, OnDestroy {
  constructor(
    private host: ElementRef<HTMLElement>,
    private DOM: DOMhelpers,
    private mutationObservableService: MutationObservableService,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChildren('bar') public bars: QueryList<ElementRef>;

  @HostBinding('attr.data-size') @Input() size: ProgressSize =
    ProgressSize.medium;
  @HostBinding('attr.data-clickable') get isClickable(): boolean {
    return Boolean(
      this.config?.clickable ||
        (this.config.clickable !== false && this.clicked.observers.length > 0)
    );
  }

  @Input() data: SimpleBarChartItem[] = [];
  @Input() config: ProgressConfig = {};

  @Output()
  clicked: EventEmitter<SimpleBarChartItem> = new EventEmitter();

  private wasInView = false;
  readonly id = simpleUID('bsbc');
  private subs: Subscription[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        size: ProgressSize.medium,
        data: [],
        config: {},
      },
      [],
      true
    );

    if (changes.data) {
      this.data = this.data.map((item) => ({
        ...item,
        value: numberMinMax(valueAsNumber(true, item.value, 0), 0, 100),
      }));
    }

    if (notFirstChanges(changes)) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.setCssProps();
        }, 50);
      });
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngAfterViewInit() {
    if (!this.config.disableAnimation) {
      this.subs.push(
        this.mutationObservableService[
          this.config.animateOnEveryInView
            ? 'getElementInViewEvent'
            : 'getElementFirstInViewEvent'
        ](this.host.nativeElement, {
          outsideZone: true,
        }).subscribe((inView) => {
          if (inView || !this.config.animateOnEveryInView) {
            this.wasInView = true;
            this.setCssProps();
          }
          if (!inView && this.config.animateOnEveryInView) {
            this.wasInView = false;
            this.removeCssProps();
          }
        })
      );
    } else {
      this.setCssProps();
    }
  }

  ngOnDestroy() {
    unsubscribeArray(this.subs);
  }

  public onBarClick(event: Event | MouseEvent): void;
  public onBarClick(event: DOMMouseEvent): void {
    const target = event.target;

    if (this.clicked.observers.length && target.matches('.bsbc-bar-box')) {
      event.stopPropagation();
      const index = parseInt(target.getAttribute('data-index'), 10);

      this.zone.run(() => {
        this.clicked.emit(this.data[index]);
      });
    }
  }

  private setCssProps(): void {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--bsbc-item-count': this.data?.length || null,
    });

    this.bars
      .toArray()
      .forEach((bar: ElementRef<HTMLElement>, index: number) => {
        const barElmnt = bar.nativeElement;
        const item: SimpleBarChartItem = this.data[index];

        this.DOM.setCssProps(barElmnt, {
          '--bsbc-value':
            this.wasInView || this.config.disableAnimation
              ? (item.value || 0) + '%'
              : null,
          '--bsbc-color': item.color || null,
          '--bsbc-trans': this.config.disableAnimation
            ? '0s'
            : (item.value > 50
                ? randomNumber(750, 1500)
                : randomNumber(250, 500)) + 'ms',
          '--bsbc-trans-delay': this.config.disableAnimation
            ? '0s'
            : randomNumber(50, 200) + 'ms',
        });
      });
  }
  protected removeCssProps(): void {
    this.bars
      .toArray()
      .forEach((bar: ElementRef<HTMLElement>, index: number) => {
        const barElmnt = bar.nativeElement;
        this.DOM.setCssProps(barElmnt, {
          '--bsbc-value': null,
          '--bsbc-trans': null,
          '--bsbc-trans-delay': null,
        });
      });
  }

  public trackBy(index: number, item: SimpleBarChartItem): string {
    return index + (item.text || '');
  }
}

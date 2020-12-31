import {
  Component,
  Input,
  ViewChildren,
  ElementRef,
  QueryList,
  NgZone,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  HostBinding,
} from '@angular/core';
import { SimpleBarChartItem } from './simple-bar-chart.interface';
import {
  simpleUID,
  randomNumber,
  applyChanges,
  notFirstChanges,
  numberMinMax,
} from '../../services/utils/functional-utils';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { filter, take } from 'rxjs/operators';
import { valueAsNumber } from '../../services/utils/transformers';
import { ProgressConfig } from '../progress/progress.interface';
import { ProgressSize } from '../progress/progress.enum';
import { MutationObservableService } from '../../services/utils/mutation-observable';

@Component({
  selector: 'b-simple-bar-chart',
  templateUrl: './simple-bar-chart.component.html',
  styleUrls: ['./simple-bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleBarChartComponent implements OnChanges, AfterViewInit {
  constructor(
    private host: ElementRef,
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

  @Output() clicked: EventEmitter<SimpleBarChartItem> = new EventEmitter<
    SimpleBarChartItem
  >();

  private wasInView = false;
  readonly id = simpleUID('bsbc');

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
      this.mutationObservableService
        .getElementInViewEvent(this.host.nativeElement)
        .pipe(outsideZone(this.zone), filter(Boolean), take(1))
        .subscribe(() => {
          this.wasInView = true;
          this.setCssProps();
        });
    } else {
      this.setCssProps();
    }
  }

  public onBarClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (this.clicked.observers.length && target.matches('.bsbc-bar-box')) {
      event.stopPropagation();
      const index = parseInt(target.getAttribute('data-index'), 10);

      this.zone.run(() => {
        this.clicked.emit(this.data[index]);
      });
    }
  }

  private setCssProps(): void {
    this.bars.toArray().forEach((bar: ElementRef, index: number) => {
      const barElmnt = bar.nativeElement as HTMLElement;
      const item: SimpleBarChartItem = this.data[index];

      this.DOM.setCssProps(this.host.nativeElement, {
        '--bsbc-item-count': this.data?.length || null,
      });
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

  public trackBy(index: number, item: SimpleBarChartItem): string {
    return index + (item.text || '');
  }
}

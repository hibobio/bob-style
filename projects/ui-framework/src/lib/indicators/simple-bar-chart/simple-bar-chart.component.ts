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
} from '@angular/core';
import { SimpleBarChartItem } from './simple-bar-chart.interface';
import {
  simpleUID,
  randomNumber,
  applyChanges,
  notFirstChanges,
  numberMinMax,
} from '../../services/utils/functional-utils';
import { UtilsService } from '../../services/utils/utils.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { filter, take } from 'rxjs/operators';
import { valueAsNumber } from '../../services/utils/transformers';
import { ProgressConfig } from '../progress/progress.interface';

@Component({
  selector: 'b-simple-bar-chart',
  templateUrl: './simple-bar-chart.component.html',
  styleUrls: ['./simple-bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleBarChartComponent implements OnChanges, AfterViewInit {
  constructor(
    private host: ElementRef,
    private utilsService: UtilsService,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChildren('bar') public bars: QueryList<ElementRef>;

  @Input() data: SimpleBarChartItem[] = [];
  @Input() config: ProgressConfig = {};

  private wasInView = false;

  readonly id = simpleUID('bsbc-');

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (changes.data) {
      this.data = this.data.map(item => ({
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
      this.utilsService
        .getElementInViewEvent(this.host.nativeElement)
        .pipe(
          outsideZone(this.zone),
          filter(i => Boolean(i)),
          take(1)
        )
        .subscribe(() => {
          this.wasInView = true;
          this.setCssProps();
        });
    } else {
      this.setCssProps();
    }
  }

  private setCssProps(): void {
    this.bars.toArray().forEach((bar: ElementRef, index: number) => {
      const barElmnt = bar.nativeElement as HTMLElement;
      const item: SimpleBarChartItem = this.data[index];

      this.DOM.setCssProps(this.host.nativeElement, {
        '--bsbc-item-count': this.data.length,
      });
      this.DOM.setCssProps(barElmnt, {
        '--bsbc-value':
          this.wasInView || this.config.disableAnimation
            ? item.value + '%'
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
}

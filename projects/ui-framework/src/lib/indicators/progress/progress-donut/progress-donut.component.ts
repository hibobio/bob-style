import {
  Component,
  ElementRef,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  OnInit,
  Input,
  HostBinding,
} from '@angular/core';
import {
  simpleUID,
  randomNumber,
  roundToDecimals,
  hasChanges,
  closestNumber,
  getKeyByValue,
  applyChanges,
} from '../../../services/utils/functional-utils';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { BaseProgressElement } from '../progress-element.abstract';
import {
  DONUT_SIZES,
  PROGRESS_DONUT_DIAMETER,
  PROGRESS_DONUT_STROKE,
} from '../progress.const';
import { MutationObservableService } from '../../../services/utils/mutation-observable';
import { DonutSize, ProgressSize } from '../progress.enum';
import { ProgressDonutConfig } from '../progress.interface';

@Component({
  selector: 'b-progress-donut',
  templateUrl: './progress-donut.component.html',
  styleUrls: ['./progress-donut.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressDonutComponent extends BaseProgressElement
  implements OnInit {
  constructor(
    protected host: ElementRef,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected mutationObservableService: MutationObservableService
  ) {
    super(host, DOM, zone, cd, mutationObservableService);
  }

  @Input() config: ProgressDonutConfig = {};
  @Input() customSize: number;

  @HostBinding('attr.data-donut-size') @Input() donutSize: DonutSize = null;

  readonly id = simpleUID('bpd-');

  public diameter: number;
  public strokeWidth: number;
  public circumference: number;

  onNgChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        donutSize: null,
      },
      [],
      true
    );

    if (hasChanges(changes, ['size', 'customSize', 'donutSize'], true)) {
      this.size =
        this.donutSize || this.customSize
          ? getKeyByValue(
              PROGRESS_DONUT_DIAMETER,
              closestNumber(
                this.donutSize
                  ? DONUT_SIZES[this.donutSize][0]
                  : this.customSize,
                Object.values(PROGRESS_DONUT_DIAMETER)
              )
            )
          : changes.size.currentValue;

      this.setCircleLengths();
    }
  }

  ngOnInit() {
    if (!this.diameter) {
      this.setCircleLengths();
    }
    super.ngOnInit();
  }

  private setCircleLengths(): void {
    this.diameter = this.donutSize
      ? DONUT_SIZES[this.donutSize][0]
      : this.customSize ||
        PROGRESS_DONUT_DIAMETER[this.size || ProgressSize.medium];

    this.strokeWidth = this.donutSize
      ? (DONUT_SIZES[this.donutSize][0] - DONUT_SIZES[this.donutSize][1]) / 2
      : this.customSize
      ? this.customSize <= 50
        ? this.customSize * 0.16
        : this.customSize * 0.12
      : PROGRESS_DONUT_STROKE[this.size || ProgressSize.medium];

    this.circumference = roundToDecimals(
      2 * 3.142 * (this.diameter / 2 - this.strokeWidth / 2),
      3
    );

    this.DOM.setCssProps(this.host.nativeElement, {
      '--bpd-circumference': this.circumference + 'px',
    });
  }

  protected setCssProps(): void {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--bpd-value-multiplier':
        this.wasInView || this.config.disableAnimation
          ? (100 - this.data.value) / 100
          : 1,

      '--bpd-color': this.data.color || null,
      '--bpd-track-color': this.data.trackColor || null,
      '--bpd-trans': this.config.disableAnimation
        ? '0s'
        : (this.data.value > 50
            ? randomNumber(1000, 2000)
            : randomNumber(500, 1000)) + 'ms',
      '--bpd-trans-delay': this.config.disableAnimation
        ? '0s'
        : randomNumber(70, 250) + 'ms',
    });
  }
}

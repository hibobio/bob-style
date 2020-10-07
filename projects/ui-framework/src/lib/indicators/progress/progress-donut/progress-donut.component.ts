import {
  Component,
  ElementRef,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  OnInit,
  Input,
} from '@angular/core';
import {
  simpleUID,
  randomNumber,
  roundToDecimals,
  hasChanges,
} from '../../../services/utils/functional-utils';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { BaseProgressElement } from '../progress-element.abstract';
import {
  ProgressDonutDiameter,
  ProgressDonutStrokeWidth,
} from '../progress.const';
import { MutationObservableService } from '../../../services/utils/mutation-observable';
import { ProgressSize } from '../progress.enum';

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

  @Input() customSize: number;

  readonly id = simpleUID('bpd-');

  public diameter: number;
  public strokeWidth: number;
  public circumference: number;

  onNgChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, ['size', 'customSize']) && this.host) {
      this.setCircleLengths();
    }
  }

  ngOnInit() {
    if (!this.diameter && this.size) {
      this.setCircleLengths();
    }
    super.ngOnInit();
  }

  private setCircleLengths(): void {
    this.diameter =
      this.customSize > 0
        ? this.customSize
        : ProgressDonutDiameter[this.size || ProgressSize.medium];
    this.strokeWidth =
      this.customSize > 0
        ? this.customSize <= 50
          ? this.customSize * 0.16
          : this.customSize * 0.12
        : ProgressDonutStrokeWidth[this.size || ProgressSize.medium];

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

import {
  Component,
  ElementRef,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import {
  simpleUID,
  randomNumber,
  roundToDecimals,
} from '../../../services/utils/functional-utils';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { BaseProgressElement } from '../progress-element.abstract';
import {
  ProgressDonutDiameter,
  ProgressDonutStrokeWidth,
} from '../progress.const';
import { MutationObservableService } from '../../../services/utils/mutation-observable';

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

  readonly id = simpleUID('bpd-');

  public diameter: number;
  public strokeWidth: number;
  public circumference: number;

  onNgChanges(changes: SimpleChanges): void {
    if (changes.size && this.host) {
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
    this.diameter = ProgressDonutDiameter[this.size];
    this.strokeWidth = ProgressDonutStrokeWidth[this.size];
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

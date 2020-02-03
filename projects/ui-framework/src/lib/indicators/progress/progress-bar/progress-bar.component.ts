import {
  Component,
  OnInit,
  Input,
  ElementRef,
  NgZone,
  SimpleChanges,
  OnChanges,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { filter, take } from 'rxjs/operators';
import {
  applyChanges,
  notFirstChanges,
  simpleUID,
  numberMinMax,
  randomNumber,
} from '../../../services/utils/functional-utils';
import { valueAsNumber } from '../../../services/utils/transformers';
import { UtilsService } from '../../../services/utils/utils.service';
import { outsideZone } from '../../../services/utils/rxjs.operators';
import { ProgressBarType, ProgressBarSize } from './progress-bar.enum';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { ProgressBarData, ProgressBarConfig } from './progress-bar.interface';

@Component({
  selector: 'b-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent implements OnChanges, OnInit {
  constructor(
    private host: ElementRef,
    private utilsService: UtilsService,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @HostBinding('attr.data-type') @Input() type: ProgressBarType =
    ProgressBarType.primary;
  @HostBinding('attr.data-size') @Input() size: ProgressBarSize =
    ProgressBarSize.medium;

  @Input() data: ProgressBarData = {} as ProgressBarData;
  @Input() config: ProgressBarConfig = {};

  private wasInView = false;

  readonly id = simpleUID('bpb-');
  readonly barType = ProgressBarType;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (changes.data) {
      this.data.value = numberMinMax(
        valueAsNumber(true, this.data.value, 0),
        0,
        100
      );
    }

    if (notFirstChanges(changes)) {
      this.setCssProps();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit() {
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
    this.DOM.setCssProps(this.host.nativeElement, {
      '--bpb-value':
        this.wasInView || this.config.disableAnimation
          ? this.data.value + '%'
          : null,
      '--bpb-color':
        (this.type !== ProgressBarType.secondary && this.data.color) || null,
      '--bpb-trans': this.config.disableAnimation
        ? '0s'
        : (this.data.value > 50
            ? randomNumber(1000, 2000)
            : randomNumber(500, 1000)) + 'ms',
      '--bpb-trans-delay': this.config.disableAnimation
        ? '0s'
        : randomNumber(70, 250) + 'ms',
    });
  }
}

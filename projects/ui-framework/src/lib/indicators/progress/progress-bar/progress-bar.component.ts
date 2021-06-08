import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
} from '@angular/core';

import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import {
  randomNumber,
  simpleUID,
} from '../../../services/utils/functional-utils';
import { MutationObservableService } from '../../../services/utils/mutation-observable';
import { BaseProgressElement } from '../progress-element.abstract';
import { ProgressBarConfig, ProgressBarData } from '../progress.interface';

@Component({
  selector: 'b-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent
  extends BaseProgressElement
  implements OnChanges, OnInit {
  constructor(
    protected host: ElementRef<HTMLElement>,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected mutationObservableService: MutationObservableService
  ) {
    super(host, DOM, zone, cd, mutationObservableService);
  }

  @Input() data: ProgressBarData;
  @Input() config: ProgressBarConfig = {};

  readonly id = simpleUID('bpb');

  protected setCssProps(): void {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--bpb-value':
        this.wasInView || this.config?.disableAnimation
          ? this.data?.value && this.data.value + '%'
          : null,
      '--bpb-color': this.data?.color || null,
      '--bpd-track-color': this.data?.trackColor || null,
      '--bpb-trans': this.config?.disableAnimation
        ? '0s'
        : (this.data?.value > 50
            ? randomNumber(1000, 2000)
            : randomNumber(500, 1000)) + 'ms',
      '--bpb-trans-delay': this.config?.disableAnimation
        ? '0s'
        : randomNumber(70, 250) + 'ms',
    });
  }

  protected removeCssProps(): void {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--bpb-value': null,
      '--bpb-trans': null,
      '--bpb-trans-delay': null,
    });
  }
}

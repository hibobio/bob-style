import {
  Component,
  OnInit,
  ElementRef,
  NgZone,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  simpleUID,
  randomNumber,
} from '../../../services/utils/functional-utils';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { BaseProgressElement } from '../progress-element.abstract';
import { MutationObservableService } from '../../../services/utils/mutation-observable';

@Component({
  selector: 'b-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent extends BaseProgressElement
  implements OnChanges, OnInit {
  constructor(
    protected host: ElementRef,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected mutationObservableService: MutationObservableService
  ) {
    super(host, DOM, zone, cd, mutationObservableService);
  }

  readonly id = simpleUID('bpb-');

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
}

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
import { UtilsService } from '../../../services/utils/utils.service';
import { ProgressType } from '../progress.enum';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { BaseProgressElement } from '../progress-element.abstract';

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
    protected utilsService: UtilsService,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef
  ) {
    super(host, utilsService, DOM, zone, cd);
  }

  readonly id = simpleUID('bpb-');

  protected setCssProps(): void {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--bpb-value':
        this.wasInView || this.config.disableAnimation
          ? this.data.value + '%'
          : null,
      '--bpb-color':
        (this.type !== ProgressType.secondary && this.data.color) || null,
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

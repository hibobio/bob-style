import {
  Component,
  ElementRef,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { simpleUID } from '../../../services/utils/functional-utils';
import { UtilsService } from '../../../services/utils/utils.service';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';

import { BaseProgressElement } from '../progress-element.abstract';

@Component({
  selector: 'b-progress-donut',
  templateUrl: './progress-donut.component.html',
  styleUrls: ['./progress-donut.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressDonutComponent extends BaseProgressElement {
  constructor(
    protected host: ElementRef,
    protected utilsService: UtilsService,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef
  ) {
    super(host, utilsService, DOM, zone, cd);
  }

  readonly id = simpleUID('bpd-');

  readonly diameter = 60;
  readonly stroke = 4;
  readonly circumference = 2 * Math.PI * (this.diameter / 2);

  protected setCssProps(): void {
    this.DOM.setCssProps(this.host.nativeElement, {});
  }
}

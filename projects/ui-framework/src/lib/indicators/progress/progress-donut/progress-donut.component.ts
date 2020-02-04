import {
  Component,
  ElementRef,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { simpleUID } from '../../../services/utils/functional-utils';
import { UtilsService } from '../../../services/utils/utils.service';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';

import { BaseProgressElement } from '../progress-element.abstract';
import { ProgressDonutDiameter } from '../progress.const';

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
    protected utilsService: UtilsService,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef
  ) {
    super(host, utilsService, DOM, zone, cd);
  }

  readonly id = simpleUID('bpd-');

  public diameter: number;
  public circumference: number;
  readonly stroke = 4;

  onNgChanges(changes: SimpleChanges): void {
    if (changes.size) {
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
    this.circumference = 2 * Math.PI * (this.diameter / 2);
  }

  protected setCssProps(): void {
    this.DOM.setCssProps(this.host.nativeElement, {});
  }
}

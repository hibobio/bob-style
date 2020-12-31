import {
  Component,
  OnInit,
  ElementRef,
  NgZone,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
  HostBinding,
  HostListener,
} from '@angular/core';
import {
  simpleUID,
  hasChanges,
  isNotEmptyArray,
  isString,
  randomNumber,
  cloneDeepSimpleObject,
} from '../../../services/utils/functional-utils';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { BaseProgressElement } from '../progress-element.abstract';
import { MutationObservableService } from '../../../services/utils/mutation-observable';
import {
  MultiProgressBarConfig,
  MultiProgressBarData,
} from '../progress.interface';
import { valueAsNumber } from '../../../services/utils/transformers';
import { ColorPaletteService } from '../../../services/color-service/color-palette.service';

@Component({
  selector: 'b-multi-progress-bar',
  template: '',
  styleUrls: ['./multi-progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiProgressBarComponent extends BaseProgressElement
  implements OnChanges, OnInit {
  constructor(
    protected host: ElementRef,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected mutationObservableService: MutationObservableService,
    private colorPaletteService: ColorPaletteService
  ) {
    super(host, DOM, zone, cd, mutationObservableService);
    this.data = this.dataDef = [];
  }

  @Input() data: MultiProgressBarData[] = [];
  @Input() config: MultiProgressBarConfig = {};

  readonly id = simpleUID('bmpb');

  @HostBinding('attr.id') get idAttr() {
    return this.id;
  }

  @HostListener('click.outside-zone', ['$event'])
  onHostClick($event: MouseEvent) {
    if (this.clicked.observers.length > 0) {
      this.zone.run(() => {
        this.onClick();
      });
    }
  }

  onNgChanges(changes: SimpleChanges): void {
    //
    if (
      hasChanges(changes, ['data'], true, {
        truthyCheck: isNotEmptyArray,
      }) ||
      hasChanges(changes, ['config'], true)
    ) {
      this.data = cloneDeepSimpleObject(this.data);
      let valueSum = this.config?.total || 0;

      this.data.forEach((d) => {
        d.value = valueAsNumber(true, d.value, 0);

        if (!this.config?.total) {
          valueSum += d.value;
        }
      });

      if (valueSum !== 100) {
        this.data.forEach((d) => {
          d.value = (d.value * 100) / valueSum;
        });
      }

      this.data = this.data.sort((a, b) =>
        this.config?.direction === 'min-to-max'
          ? a.value - b.value
          : b.value - a.value
      );

      this.data.forEach((d, i) => {
        d.color = isString(d.color)
          ? d.color
          : this.colorPaletteService.getPaletteColorByIndex(i);
      });
    }
  }

  protected setCssProps(): void {
    const totalValues = this.data.length;
    const bgImg =
      'linear-gradient(to right, ' +
      this.data
        .reduce(
          (acc, d, i) => {
            acc.val.push(
              `${d.color} ${acc.pos}%, ${d.color} ${
                i < totalValues - 1 ? (acc.pos += d.value) : 100
              }%`
            );

            return acc;
          },
          { val: [], pos: 0 }
        )
        .val.join(', ') +
      ')';

    this.DOM.setCssProps(this.host.nativeElement, {
      '--bmpb-img': bgImg,
      '--bmpb-img-size': '100% 100%',
      '--bmpb-track-color': this.config?.trackColor || null,
      '--bmpb-trans': this.config?.disableAnimation
        ? '0s'
        : randomNumber(500, 1000) + 'ms',
      '--bmpb-trans-delay': this.config?.disableAnimation
        ? '0s'
        : randomNumber(70, 250) + 'ms',
    });
  }
}

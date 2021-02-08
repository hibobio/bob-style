import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Types } from '../../enums';
import { ColorsGrey } from '../../services/color-service/color-palette.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  hasChanges,
  isArray,
  isDark,
  isObject,
} from '../../services/utils/functional-utils';
import { LegendConfig, LegendData } from './legend.interface';

@Component({
  selector: 'b-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
})
export class LegendComponent implements OnChanges {
  constructor(private hostElRef: ElementRef, private DOM: DOMhelpers) {}

  @Input('config') set setConfig(config: LegendConfig) {
    let sortByValue =
      config?.sortByValue !== undefined
        ? config?.sortByValue
        : this.config?.sortByValue || false;
    sortByValue = sortByValue === true ? 'asc' : sortByValue || false;

    this.config = {
      ...this.config,
      ...config,
      columns: config.columns || this.config.columns || 3,
      rowGap: config.rowGap || this.config.rowGap || 8,
      type: config.type || this.config.type || Types.primary,
      layout: config.layout || this.config.layout || 'grid',
      flow: config.flow || this.config.flow || 'row',
      sortByValue,
    };
  }
  public config: LegendConfig;

  @Input('data') set setData(data: LegendData[]) {
    this.data = (data || []).map((item) => ({
      ...item,
      value: item.value !== undefined ? item.value : null,
      color: item.color || null,
      valueTextColor: !item.color
        ? null
        : isDark(item.color, 215)
        ? 'white'
        : ColorsGrey.color_grey_800,
    }));
  }
  public data: LegendData[];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      hasChanges(changes, ['setData'], true, {
        skipSetters: false,
        discardAllFalsey: true,
        truthyCheck: isArray,
      })
    ) {
      this.config = {
        ...this.config,
        hasColor: this.data.some((i) => Boolean(i.color)),
        hasValue: this.data.some((i) => Boolean(i.value)),
      };
      this.DOM.setCssProps(this.hostElRef.nativeElement, {
        '--blc-rows': Math.ceil(this.data.length / (this.config.columns || 3)),
      });
    }

    if (
      hasChanges(changes, ['setConfig'], true, {
        skipSetters: false,
        discardAllFalsey: true,
        truthyCheck: isObject,
        checkEquality: true,
        equalCheck: (confA: LegendConfig, confB: LegendConfig) => {
          return (
            confA?.maxHeight === confB?.maxHeight &&
            confA?.columns === confB?.columns &&
            confA?.rowGap === confB?.rowGap &&
            confA?.type === confB?.type
          );
        },
      })
    ) {
      this.DOM.bindClasses(this.hostElRef.nativeElement, {
        'scroll-visible-alt': Boolean(this.config.maxHeight),
      });
      this.DOM.setCssProps(this.hostElRef.nativeElement, {
        'max-height': this.config.maxHeight
          ? this.config.maxHeight + 'px'
          : null,
        '--blc-cols': this.config.columns,
        '--blc-row-gap': this.config.rowGap + 'px',
        '--blc-circle-size':
          (this.config.type === Types.secondary ? 12 : 20) + 'px',
      });
    }
  }
}

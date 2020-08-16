import { Pipe, PipeTransform } from '@angular/core';
import { valueAsNumber } from '../utils/transformers';
import { isNumber } from '../utils/functional-utils';

@Pipe({
  name: 'formatNumber',
  pure: true,
})
export class FormatNumberPipe implements PipeTransform {
  constructor() {}

  private decimals = 4;
  private formatter: Intl.NumberFormat;

  transform(value: string | number, decimals: number = null): string {
    if (isNumber(decimals) && decimals !== this.decimals) {
      this.decimals = decimals;
      this.formatter = undefined;
    }
    return (
      this.formatter ||
      (this.formatter = new Intl.NumberFormat('en', {
        style: 'decimal',
        useGrouping: true,
        maximumFractionDigits: this.decimals,
      }))
    ).format(valueAsNumber(true, value, '', this.decimals));
  }
}

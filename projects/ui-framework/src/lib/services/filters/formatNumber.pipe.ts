import { Pipe, PipeTransform } from '@angular/core';
import { valueAsNumber } from '../utils/transformers';

@Pipe({
  name: 'formatNumber',
  pure: true,
})
export class FormatNumberPipe implements PipeTransform {
  constructor() {}

  private formatter = new Intl.NumberFormat('en', {
    style: 'decimal',
    useGrouping: true,
    maximumFractionDigits: 2,
  });

  transform(value: string | number): string {
    return this.formatter.format(valueAsNumber(true, value, 0));
  }
}

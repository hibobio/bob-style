import { Pipe, PipeTransform } from '@angular/core';
import { capitalize, capitalizeAll } from '../utils/functional-utils';

@Pipe({
  name: 'capitalize',
  pure: true,
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return capitalize(value);
  }
}

// same as angular | titlecase (TitleCasePipe)
@Pipe({
  name: 'capitalizeAll',
  pure: true,
})
export class CapitalizeAllPipe implements PipeTransform {
  transform(value: string): string {
    return capitalizeAll(value);
  }
}

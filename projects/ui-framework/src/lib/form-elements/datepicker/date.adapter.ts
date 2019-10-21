import { NativeDateAdapter } from '@angular/material/core';
import { format } from 'date-fns';

export class BDateAdapter extends NativeDateAdapter {
  public static bFormat = 'dd/MM/yyyy';
  public static readonly monthFormat = 'MMM';
  public static readonly monthYearFormat = 'MMM yyyy';

  parse(value: any): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
  format(date: Date, displayFormat: any): string {
    switch (displayFormat) {
      case 'input':
        return format(date, BDateAdapter.bFormat);
      case 'inputMonth':
        return format(date, BDateAdapter.monthFormat);
      case 'monthYearFormat':
        return format(date, BDateAdapter.monthYearFormat);
      default:
        return date.toDateString();
    }
  }
}

export const B_DATE_FORMATS = {
  parse: {
    dateInput: { day: 'numeric', month: 'short', year: 'numeric' }
  },
  display: {
    dateInput: 'input',
    monthYearLabel: 'monthYearFormat',
    dateA11yLabel: { day: 'numeric', month: 'long', year: 'numeric' },
    monthYearA11yLabel: { month: 'short', year: 'numeric' }
  }
};

import { Component, forwardRef } from '@angular/core';
import { BaseInputElement } from '../base-input-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectGroupOption } from '../lists';
import map from 'lodash/map';

@Component({
  selector: 'b-split-input-single-select',
  templateUrl: './split-input-single-select.component.html',
  styleUrls: ['./split-input-single-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SplitInputSingleSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SplitInputSingleSelectComponent),
      multi: true
    }
  ],
})
export class SplitInputSingleSelectComponent extends BaseInputElement {

  private currencies = [
    { value: 'AED', serverId: null },
    { value: 'ANG', serverId: null },
    { value: 'AUD', serverId: null },
    { value: 'AZN', serverId: null },
    { value: 'BAM', serverId: null },
    { value: 'BGN', serverId: null },
    { value: 'BRL', serverId: null },
    { value: 'BTC', serverId: null },
    { value: 'BWP', serverId: null },
    { value: 'CAD', serverId: null },
    { value: 'CHF', serverId: null },
    { value: 'CLP', serverId: null },
    { value: 'CNY', serverId: null },
    { value: 'COP', serverId: null },
    { value: 'CZK', serverId: null },
    { value: 'DKK', serverId: null },
    { value: 'EGP', serverId: null },
    { value: 'EUR', serverId: null },
    { value: 'GBP', serverId: null },
    { value: 'HKD', serverId: null },
    { value: 'HUF', serverId: null },
    { value: 'IDR', serverId: null },
    { value: 'ILS', serverId: null },
    { value: 'INR', serverId: null },
    { value: 'JPY', serverId: null },
    { value: 'KES', serverId: null },
    { value: 'KRW', serverId: null },
    { value: 'MAD', serverId: null },
    { value: 'MMK', serverId: null },
    { value: 'MXN', serverId: null },
    { value: 'MYR', serverId: null },
    { value: 'NGN', serverId: null },
    { value: 'NOK', serverId: null },
    { value: 'NPR', serverId: null },
    { value: 'NZD', serverId: null },
    { value: 'PEN', serverId: null },
    { value: 'PHP', serverId: null },
    { value: 'PLN', serverId: null },
    { value: 'RON', serverId: null },
    { value: 'RUB', serverId: null },
    { value: 'SEK', serverId: null },
    { value: 'SGD', serverId: null },
    { value: 'THB', serverId: null },
    { value: 'TRY', serverId: null },
    { value: 'TWD', serverId: null },
    { value: 'TZS', serverId: null },
    { value: 'UAH', serverId: null },
    { value: 'USD', serverId: null },
    { value: 'UYU', serverId: null },
    { value: 'VND', serverId: null },
    { value: 'XOF', serverId: null },
    { value: 'ZAR', serverId: null },
  ];

  optionsMock: SelectGroupOption[] = Array.from(Array(1), (_, i) => {
    return {
      groupName: 'all currencies',
      options: map(this.currencies, currency => ({
        value: currency.value,
        id: currency.value,
      })),
    };
  });

  constructor() {
    super();
  }
}

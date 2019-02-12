import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { BaseInputElement } from '../base-input-element';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AvatarSize } from '../../buttons-indicators/avatar';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { map, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AutoCompleteOption } from './auto-complete.interface';

@Component({
  selector: 'b-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AutoCompleteComponent),
      multi: true
    }
  ],
})
export class AutoCompleteComponent extends BaseInputElement implements OnInit {

  @Input() options: AutoCompleteOption[];

  avatarSize = AvatarSize;
  filteredOptions: Observable<AutoCompleteOption[]>;
  selectedAvatarUrl: string = null;
  selectedOption: AutoCompleteOption = null;
  myControl: FormControl = new FormControl();
  optionsPanelHeight: number;
  readonly optionHeight = 44;

  constructor() {
    super();
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | any>(''),
        tap(option => {
          if (typeof option === 'string') {
            this.selectedOption = null;
            this.selectedAvatarUrl = null;
          }
        }),
        map(option => typeof option === 'string' ? option : option.value),
        map(option => option ? this.filter(option) : this.options.slice())
      );

    this.filteredOptions.subscribe(a => {
      this.optionsPanelHeight = a.length * this.optionHeight;
    });
  }

  displayFn(option: AutoCompleteOption): string | null {
    return option ? option.value : null;
  }

  onOptionsSelected($event: MatAutocompleteSelectedEvent) {
    this.selectedOption = $event.option.value;
    this.selectedAvatarUrl = this.selectedOption.avatar;
    // this.notify(this.selectedOption);
  }

  onPanelClosed(): void {
    if (!this.selectedOption) {
      this.value = '';
    }
    this.notify(this.selectedOption);
  }

  private filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return filterValue === ''
      ? []
      : this.options.filter(option =>
        option.value.toLowerCase().includes(filterValue)
      );
  }

  private notify(option: AutoCompleteOption): void {
    // console.log('notify select', option);
  }
}

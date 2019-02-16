import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { set } from 'lodash';
import { BaseFormElement } from '../base-form-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

export enum CheckboxStates {
  checked = 'checked',
  unchecked = 'unchecked',
}

@Component({
  selector: 'b-checkbox',
  template: `
    <div class="checkbox-wrapper"
         [ngClass]="{'disabled': disabled, 'required': required }"
         (click)="toggleCheckbox()">
      <mat-pseudo-checkbox [state]="checkboxState"
                           class="checkbox">
      </mat-pseudo-checkbox>
      <label>{{label}}</label>
    </div>
  `,
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
})
export class CheckboxComponent extends BaseFormElement implements OnChanges {

  @Input() value = false;
  @Input() label: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Output() checkboxChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  checkboxState: CheckboxStates;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkboxState = this.getCheckboxState();
  }

  toggleCheckbox(): void {
    this.value = !this.value;
    this.checkboxState = this.getCheckboxState();
    this.propagateChange(this.value);
    this.checkboxChange.emit(this.value);
  }

  getCheckboxState(): CheckboxStates {
    return this.value ? CheckboxStates.checked : CheckboxStates.unchecked;
  }
}

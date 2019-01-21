import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { set } from 'lodash';

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
      <label>{{placeholder}}</label>
    </div>
  `,
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {

  @Input() value = false;
  @Input() placeholder: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Output() checkboxChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  checkboxState: CheckboxStates;

  constructor() {
  }

  ngOnInit(): void {
    this.checkboxState = this.getCheckboxState();
  }

  toggleCheckbox(): void {
    this.value = !this.value;
    this.checkboxState = this.getCheckboxState();
    this.checkboxChange.emit(this.value);
  }

  getCheckboxState(): CheckboxStates {
    return this.value ? CheckboxStates.checked : CheckboxStates.unchecked;
  }
}

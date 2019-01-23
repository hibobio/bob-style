import { Component, forwardRef, ViewChild } from '@angular/core';
import { InputEventType } from './input.enum';
import { inputAttributesPlaceholder } from '../../consts';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../base-input-element';
import { MatInput } from '@angular/material';
import { formElementProviders } from '../form-elements.consts';

export const baseInputTemplate = `
<mat-form-field
  [ngClass]="{
    'required': required,
    'error': errorMessage,
    'hide-label-on-focus': hideLabelOnFocus,
    'has-prefix': prefix && prefix.childNodes.length > 0,
    'has-suffix': suffix && suffix.childNodes.length > 0
  }">

  <div matPrefix>
    <div class="prefix" #prefix>
      <ng-content select="[input-prefix]"></ng-content>
    </div>
  </div>

  <input matInput
         [type]="inputType"
         [disabled]="disabled"
         [(ngModel)]="value"
         [autocomplete]="enableBrowserAutoComplete"
         (blur)="emitInputEvent(eventType.onBlur, value)"
         (focus)="emitInputEvent(eventType.onFocus, value)"
         (ngModelChange)="emitInputEvent(eventType.onChange, value)"
         #bInput
         #moreattributes>

  <mat-hint class="error-message" *ngIf="errorMessage">
    {{errorMessage}}
  </mat-hint>

  <mat-hint class="hint-message" *ngIf="hintMessage && !errorMessage">
    {{hintMessage}}
  </mat-hint>

  <div matSuffix>
    <div class="suffix" #suffix>
      <ng-content select="[input-suffix]"></ng-content>
    </div>
  </div>

  <mat-label>{{label}}</mat-label>

</mat-form-field>
`;

@Component({
  selector: 'b-input',
  template: baseInputTemplate,
  styleUrls: ['./input.component.scss'],
  providers: formElementProviders(InputComponent),
})
export class InputComponent extends BaseInputElement {

  @ViewChild('bInput') bInput: MatInput;
  eventType = InputEventType;

  constructor() {
    super();
  }

  static addAttributesToBaseInput(attributes: string): string {
    return baseInputTemplate.replace(inputAttributesPlaceholder, attributes);
  }
}

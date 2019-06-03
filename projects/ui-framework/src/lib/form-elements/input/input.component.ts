import { Component, forwardRef, ViewChild } from '@angular/core';
import { InputEventType } from './input.enum';
import { inputAttributesPlaceholder } from '../../consts';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../base-input-element';
import { MatInput } from '@angular/material';

export const baseInputTemplate = `
<mat-form-field
  [floatLabel]="'always'"
  [ngClass]="{
    'required': required,
    'error': errorMessage,
    'hide-label-on-focus': hideLabelOnFocus,
    'has-prefix': prefix && prefix.childNodes.length > 0,
    'has-suffix': suffix && suffix.childNodes.length > 0
  }">
  <mat-label>{{label}}</mat-label>

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

  <div matSuffix>
    <div class="suffix" #suffix>
      <ng-content select="[input-suffix]"></ng-content>
    </div>
  </div>

  <mat-hint>
    <p
      b-input-message
      *ngIf="hintMessage || warnMessage || errorMessage"
      [hintMessage]="hintMessage"
      [warnMessage]="warnMessage"
      [errorMessage]="errorMessage"
      [disabled]="disabled"
    ></p>
  </mat-hint>

</mat-form-field>

`;

@Component({
  selector: 'b-input',
  template: baseInputTemplate,
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
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

import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { InputAutoCompleteOptions, InputEventType, InputTypes } from './input.enum';
import { inputAttributesPlaceholder } from '../../consts';
import { MatInput } from '@angular/material';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputEvent } from './input.interface';
import { BaseFormElement } from '../base-form-element';
import { includes } from 'lodash';

export const baseInputTemplate = `
<mat-form-field
  [ngClass]="{
    'required': required,
    'error': errorMessage,
    'hide-label-on-focus': hideLabelOnFocus,
    'has-prefix': hasTranscludeContent(prefix),
    'has-suffix': hasTranscludeContent(suffix)
  }">

  <div matPrefix>
    <div class="prefix" #prefix>
      <ng-content select="[input-prefix]"></ng-content>
    </div>
  </div>

  <input matInput
         [type]="inputType"
         [disabled]="disabled"
         [placeholder]="placeholder"
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
export class InputComponent extends BaseFormElement implements OnInit {

  constructor() {
    super();
  }

  @Input() inputType: InputTypes;
  @Input() placeholder: string;
  @Input() hideLabelOnFocus = false;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions = InputAutoCompleteOptions.off;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();

  @ViewChild('bInput') bInput: MatInput;
  eventType = InputEventType;
  readonly emptyNodeNames = ['empty', '#comment'];

  static addAttributesToBaseInput(attributes: string): string {
    return baseInputTemplate.replace(inputAttributesPlaceholder, attributes);
  }

  ngOnInit() {
  }

  emitInputEvent(
    event: InputEventType,
    value: string | number,
  ): void {
    this.inputEvents.emit({
      event,
      value,
    });
    if (event === InputEventType.onChange) {
      this.propagateChange(value);
    }
  }

  hasTranscludeContent(node: HTMLElement): boolean {
    return node.childNodes.length > 0 && (node.childNodes.length > 1 ||
      !includes(this.emptyNodeNames, node.childNodes[0].nodeName));
  }
}

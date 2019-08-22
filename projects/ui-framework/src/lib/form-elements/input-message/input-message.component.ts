import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'b-input-message, [b-input-message]',
  template: `
    <span
      [ngClass]="
        this.disabled
          ? 'disabled '
          : '' +
            (this.errorMessage && !this.disabled
              ? 'error'
              : this.warnMessage && !this.errorMessage && !this.disabled
              ? 'warn'
              : 'hint')
      "
    >
      {{
        errorMessage && !disabled
          ? errorMessage
          : warnMessage && !errorMessage && !disabled
          ? warnMessage
          : hintMessage
      }}
    </span>
    <span
      *ngIf="maxChars || (minChars && !maxChars && length < minChars)"
      class="length-indicator"
      [ngClass]="{
        error: length < minChars || (maxChars && length > maxChars),
        warn: maxChars && length < maxChars && maxChars - length < 15
      }"
    >
      {{ length || 0 }}/{{
        (minChars && !maxChars) || (minChars && maxChars && length < minChars)
          ? minChars
          : maxChars
      }}
    </span>
    <ng-content></ng-content>
  `,
  styleUrls: ['./input-message.component.scss']
})
export class InputMessageComponent {
  constructor() {}
  @Input() disabled = false;
  @Input() hintMessage: string;
  @Input() warnMessage: string;
  @Input() errorMessage: string;
  @Input() minChars: number;
  @Input() maxChars: number;
  @Input() length: number;
}

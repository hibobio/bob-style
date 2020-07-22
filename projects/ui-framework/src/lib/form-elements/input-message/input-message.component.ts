import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'b-input-message, [b-input-message]',
  template: `
    <span
      *ngIf="hintMessage || warnMessage || errorMessage"
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
      *ngIf="maxChars > 0"
      class="length-indicator"
      [ngClass]="{
        error: maxChars && length > maxChars,
        warn: maxChars && length < maxChars && maxChars - length < 15
      }"
    >
      {{ length || 0 }}/{{ maxChars }}
    </span>
    <ng-content></ng-content>
  `,
  styleUrls: ['./input-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

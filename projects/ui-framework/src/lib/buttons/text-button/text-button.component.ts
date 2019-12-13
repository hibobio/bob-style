import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { LinkColor } from '../../indicators/link/link.enum';
import { BaseButtonElement } from '../button.abstract';

@Component({
  selector: 'b-text-button',
  template: `
    <i *ngIf="icon" class="{{ getIconClass() }}"></i>
    {{ text }}
    <ng-content></ng-content>
  `,
  styleUrls: ['./text-button.component.scss'],
  providers: [{ provide: BaseButtonElement, useExisting: TextButtonComponent }],
})
export class TextButtonComponent extends BaseButtonElement {
  @HostBinding('class.color-primary') get colorPrimary(): boolean {
    return this.color === LinkColor.primary;
  }
  @HostBinding('class.disabled') @Input() disabled = false;

  @Input() color: LinkColor = LinkColor.none;

  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    if (this.clicked.observers.length > 0) {
      this.clicked.emit($event);
    }
  }

  getIconClass(): string {
    return (
      'b-icon ' +
      this.icon +
      ' b-icon-' +
      IconSize.medium +
      ' b-icon-' +
      (this.color === LinkColor.none ? IconColor.dark : IconColor.primary)
    );
  }
}

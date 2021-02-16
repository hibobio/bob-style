import { Component, Input, Output, EventEmitter } from '@angular/core';
import { isFunction } from '../../services/utils/functional-utils';
import { Link } from '../link/link.types';

@Component({
  selector: 'b-link',
  template: `
    <a
      [attr.href]="config.url || null"
      [attr.target]="config.target || null"
      [style.color]="config.color || null"
      [class.primary]="config.color === 'primary'"
      (click)="onClick()"
      >{{ config.text }}</a
    >
  `,
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent {
  @Input() config: Link = {} as any;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    isFunction(this.config.clickHandler) && this.config.clickHandler();
    this.clicked.emit();
  }
}

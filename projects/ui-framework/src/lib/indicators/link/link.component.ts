import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Link } from '../link/link.types';

@Component({
  selector: 'b-link',
  template: `
    <a
      [attr.href]="config.url || null"
      [attr.target]="config.target || null"
      [ngClass]="config.color || null"
      (click)="clicked.emit()"
      >{{ config.text }}</a
    >
  `,
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent {
  @Input() config: Link;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();
}

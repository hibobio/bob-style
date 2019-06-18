import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';
import { LinkColor } from '../../link/link.enum';

@Component({
  selector: 'b-text-button',
  template: `
    <b-icon *ngIf="icon"
            [icon]="icon"
            [size]="iconSize.medium"
            [color]="color===linkColor.none ? iconColor.dark : iconColor.primary">
    </b-icon>
    <b-bold-body>{{text}}</b-bold-body>
  `,
  styleUrls: ['./text-button.component.scss']
})
export class TextButtonComponent {

  @Input() text: string;
  @Input() icon: Icons;
  @Input() color: LinkColor = LinkColor.none;
  @Input() disabled = false;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  readonly iconSize = IconSize;
  readonly linkColor = LinkColor;
  readonly iconColor = IconColor;

  @HostListener('click')
  onClick() {
    this.clicked.emit();
  }

  @HostBinding('class.disabled') get isDisabled(): boolean {
    return this.disabled;
  }

  @HostBinding('class.color-primary') get colorPrimary(): boolean {
    return this.color === LinkColor.primary;
  }
}

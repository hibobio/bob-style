import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';
import { LinkColor } from '../../link/link.enum';

@Component({
  selector: 'b-text-button',
  template: `
    <i
      *ngIf="icon"
      class="b-icon {{
        icon +
          ' b-icon-' +
          iconSize.medium +
          ' b-icon-' +
          (color === linkColor.none ? iconColor.dark : iconColor.primary)
      }}"
    ></i>

    {{ text }}
    <ng-content></ng-content>
  `,
  styleUrls: ['./text-button.component.scss']
})
export class TextButtonComponent {
  @HostBinding('class.color-primary') get colorPrimary(): boolean {
    return this.color === LinkColor.primary;
  }
  @HostBinding('class.disabled') @Input() disabled = false;

  @Input() text: string;
  @Input() icon: Icons;
  @Input() color: LinkColor = LinkColor.none;

  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  readonly iconSize = IconSize;
  readonly linkColor = LinkColor;
  readonly iconColor = IconColor;

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    this.clicked.emit($event);
  }
}

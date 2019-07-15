import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';

@Component({
  selector: 'b-button',
  template: `
    <button
      type="button"
      class="{{ type }} {{ size }} {{
        icon ? icon + ' b-icon-' + iconSize + ' b-icon-' + iconColor : ''
      }}"
      [ngClass]="{ disabled: disabled }"
      (click.outside-zone)="onClick($event)"
    >
      {{ text }}
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnChanges {
  @Input() text: string;
  @Input() type?: ButtonType = ButtonType.primary;
  @Input() size?: ButtonSize = ButtonSize.medium;
  @Input() disabled = false;
  @Input() icon: Icons;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  iconColor: IconColor;
  iconSize: IconSize;

  constructor() {}

  ngOnChanges(): void {
    if (this.icon) {
      this.iconColor =
        this.type === ButtonType.primary
          ? IconColor.white
          : this.disabled
          ? IconColor.light
          : IconColor.dark;
      this.iconSize =
        this.size === ButtonSize.large ? IconSize.large : IconSize.medium;
    }
  }

  onClick($event) {
    this.clicked.emit($event);
  }
}

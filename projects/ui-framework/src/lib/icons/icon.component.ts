import { Component, Input, HostBinding } from '@angular/core';
import { IconColor, Icons, IconSize } from './icons.enum';

@Component({
  selector: 'b-icon',
  template: `
    <span class="b-icon" [ngClass]="getIconClass()" aria-hidden="true"></span>
  `,
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input() icon: Icons;
  @Input() size: IconSize = IconSize.medium;
  @Input() color: IconColor = IconColor.dark;
  @Input() hasHoverState = false;

  @HostBinding('attr.data-tooltip') @Input() toolTipSummary: string = null;

  getIconClass(): string {
    return (
      this.icon +
      ' b-icon-' +
      this.size +
      ' b-icon-' +
      this.color +
      (this.hasHoverState ? ' has-hover' : '')
    );
  }
}

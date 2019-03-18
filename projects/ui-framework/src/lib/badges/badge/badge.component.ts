import { Component, Input, HostBinding } from '@angular/core';
import { BadgeType } from '../badges.enum';

@Component({
  selector: 'b-badge',
  template: `
    {{ text }}
  `,
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {

  constructor() { }

  @Input() text = '';
  @Input() type?: BadgeType = BadgeType.default;

  @HostBinding('class') //class = this.type;
  get typeClass() {
    return 'badge-' + this.type;
  }

}

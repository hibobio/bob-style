import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarSize } from './avatar.enum';

@Component({
  selector: 'b-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() imageSource: string;
  @Input() size?: AvatarSize = AvatarSize.mini;
  @Input() isClickable ? = false;
  @Output() clicked?: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  onClick(event) {
    if (this.isClickable) {
      this.clicked.emit(event);
    }
  }

  getClassNames() {
    return `${this.size}${this.isClickable ? ' clickable' : ''}`;
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';

@Component({
  selector: 'b-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent {
  @Input() icon: Icons;
  @Input() imageUrl?: string;
  @Input() backgroundSize = 'contain';
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;
  readonly iconShape = Icons;
  constructor() {}


  onIconClick() {
    this.clicked.emit();
  }
}

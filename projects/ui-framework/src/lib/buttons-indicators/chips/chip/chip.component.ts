import { Component, Input, HostBinding } from '@angular/core';
import { ChipType } from '../chips.enum';

@Component({
  selector: 'b-chip, [b-chip]',
  template: `
    <mat-basic-chip [selectable]="false" [disableRipple]="true">
      <ng-content></ng-content>
      {{ text }}
    </mat-basic-chip>
  `,
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  constructor() {}

  @Input() text = '';
  @Input() type: ChipType = ChipType.default;

  @HostBinding('class')
  get typeClass() {
    return 'chip-' + this.type;
  }
}

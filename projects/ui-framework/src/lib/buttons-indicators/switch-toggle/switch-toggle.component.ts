import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'b-switch-toggle',
  templateUrl: './switch-toggle.component.html',
  styleUrls: ['./switch-toggle.component.scss']
})
export class SwitchToggleComponent {
  @Input() isChecked: boolean;
  @Input() isDisabled: boolean;
  @Output() switchChange: EventEmitter<MatSlideToggleChange> = new EventEmitter<MatSlideToggleChange>();

  constructor() {
  }

  onChange($event: MatSlideToggleChange): void {
    this.switchChange.emit($event);
  }
}

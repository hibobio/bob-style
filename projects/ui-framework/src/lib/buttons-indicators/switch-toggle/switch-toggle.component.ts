import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'b-switch-toggle',
  templateUrl: './switch-toggle.component.html',
  styleUrls: ['./switch-toggle.component.scss']
})
export class SwitchToggleComponent implements OnInit {
  @Input() isChecked: boolean;
  @Input() isDisabled: boolean;
  @Output() changed: EventEmitter<MatSlideToggleChange> = new EventEmitter<MatSlideToggleChange>();

  constructor() { }

  ngOnInit() {
  }

  public onChange($event: MatSlideToggleChange): void {
    this.changed.emit($event);
  }
}

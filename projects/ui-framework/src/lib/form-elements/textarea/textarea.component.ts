import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputEventType } from '../input/input.enum';
import { InputEvent } from '../input/input.interface';

@Component({
  selector: 'b-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent implements OnInit {

  @Input() maxChars: number;
  @Input() placeholder: string;
  @Input() value: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();

  eventType = InputEventType;

  constructor() {
  }

  ngOnInit() {
  }

  emitInputEvent(
    event: InputEventType,
    value: string | number,
  ): void {
    this.inputEvents.emit({
      event,
      value,
    });
  }
}

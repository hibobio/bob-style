import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ElementRef,
  ViewChild,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { BaseFormElement } from '../base-form-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputEvent } from '../input/input.interface';
import { InputEventType } from '../form-elements.enum';
import { FormEvents } from '../form-elements.enum';
import { booleanOrFail } from '../../services/utils/transformers';

@Component({
  selector: 'b-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent extends BaseFormElement implements OnChanges {
  constructor() {
    super();
    this.inputTransformers = [booleanOrFail];
    this.wrapEvent = false;
    this.baseValue = false;
  }

  @ViewChild('input', { static: true }) public input: ElementRef;
  @Input() public value = false;
  @Input() public indeterminate = false;

  @Output(FormEvents.checkboxChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  private transmit(event: InputEventType): void {
    this.transmitValue(this.value, {
      eventType: [event],
      addToEventObj: {
        indeterminate: this.indeterminate
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.indeterminate) {
      this.indeterminate = changes.indeterminate.currentValue;
      this.input.nativeElement.indeterminate = this.indeterminate;
    }
    if (changes.value) {
      this.writeValue(changes.value.currentValue);
    }
    if (changes.value || changes.indeterminate) {
      this.transmit(InputEventType.onWrite);
    }
  }

  public toggleCheckbox(): void {
    this.value = this.input.nativeElement.checked;
    this.indeterminate = false;
    this.transmit(InputEventType.onChange);
  }
}

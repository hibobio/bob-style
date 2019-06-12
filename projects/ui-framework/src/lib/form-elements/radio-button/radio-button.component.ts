import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { RadioDirection } from './radio-button.enum';
import { InputEventType } from '../form-elements.enum';
import { RadioConfig } from './radio-button.interface';
import { FormEvents } from '../form-elements.enum';
import { InputEvent } from '../input/input.interface';
import { valueInArrayOrFail } from '../../services/utils/transformers';

@Component({
  selector: 'b-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    }
  ]
})
export class RadioButtonComponent extends BaseFormElement implements OnChanges {
  constructor() {
    super();
    this.inputTransformers = [
      value => valueInArrayOrFail(value, this.optionsFlat)
    ];
    this.wrapEvent = false;
  }

  @Input() value: string | number;
  @Input() options: string[] | RadioConfig[];
  public optionsFlat: (string | number)[] = [];
  @Input() direction: RadioDirection = RadioDirection.row;

  public dir = RadioDirection;
  public includeOptionInEvent = true;

  @Output(FormEvents.radioChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  private transmit(event: InputEventType): void {
    this.transmitValue(this.value, {
      eventType: [event],
      addToEventObj:
        (this.options as RadioConfig[])[0].label && this.includeOptionInEvent
          ? {
              option: (this.options as RadioConfig[]).find(
                o => o.label === this.value
              )
            }
          : {}
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.options = changes.options.currentValue;

      this.optionsFlat = (this.options as RadioConfig[])[0].label
        ? (this.options as RadioConfig[]).map(o => o.label)
        : (this.options as string[]);
    }

    if (changes.value || changes.options) {
      this.writeValue(changes.value ? changes.value.currentValue : this.value);
      this.transmit(InputEventType.onWrite);
    }
  }

  public onRadioChange(event): void {
    this.writeValue(event.target.value);
    this.transmit(InputEventType.onBlur);
  }
}

import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { RadioDirection } from './radio-button.enum';
import { InputEventType } from '../form-elements.enum';
import { RadioConfig } from './radio-button.interface';
import { FormEvents } from '../form-elements.enum';
import { InputEvent } from '../input/input.interface';
import {
  valueInArrayOrFail,
  objectHasKeyOrFail,
  valueToObjectKey,
} from '../../services/utils/transformers';
import {
  isNullOrUndefined,
  hasProp,
  notFirstChanges,
} from '../../services/utils/functional-utils';

@Component({
  selector: 'b-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
  ],
})
export class RadioButtonComponent extends BaseFormElement implements OnChanges {
  constructor(cd: ChangeDetectorRef) {
    super(cd);

    this.inputTransformers = [
      valueToObjectKey(this.key),
      objectHasKeyOrFail(this.key),
      value => valueInArrayOrFail(value, this.options, this.key),
    ];
    this.outputTransformers = [
      value =>
        !isNullOrUndefined(value) && hasProp(value, 'id')
          ? value.id
          : undefined,
    ];
    this.baseValue = {};
    this.wrapEvent = false;
  }

  @Input() value: RadioConfig;
  // tslint:disable-next-line: no-input-rename
  @Input('radioConfig') options: RadioConfig[];
  @Input() direction: RadioDirection = RadioDirection.row;

  readonly dir = RadioDirection;
  readonly key = 'id';

  @Output(FormEvents.radioChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  private transmit(event: InputEventType): void {
    this.transmitValue(this.value, {
      eventType: [event],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.radioConfig) {
      this.options = changes.radioConfig.currentValue;
    }

    if (changes.value || changes.radioConfig) {
      const val = changes.value ? changes.value.currentValue : this.value;
      this.writeValue(val);
      this.transmit(InputEventType.onWrite);
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public onRadioChange(key): void {
    this.writeValue(this.options.find(o => o[this.key] === key));
    this.transmit(InputEventType.onBlur);
  }
}

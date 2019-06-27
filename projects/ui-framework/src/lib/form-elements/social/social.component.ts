import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { InputEvent } from '../input/input.interface';
import { InputTypes } from '../input/input.enum';
import { SocialTypes } from './social.const';
import { Social } from './social.enum';
import { BaseFormElement } from '../base-form-element';
import { FormEvents, InputEventType } from '../form-elements.enum';
import { domainFromUrl } from '../../services/utils/functional-utils';
import { InputComponent } from '../input/input.component';
import { stringyOrFail } from '../../services/utils/transformers';

@Component({
  selector: 'b-social',
  templateUrl: 'social.component.html',
  styleUrls: ['social.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SocialComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SocialComponent),
      multi: true
    }
  ]
})
export class SocialComponent extends BaseFormElement {
  constructor() {
    super();
    this.inputTransformers = [
      stringyOrFail,
      value => {
        if (value) {
          const origLength = value.length;
          const domain = domainFromUrl(value);
          value = value.split(domain)[value.split(domain).length - 1];
          if (origLength !== value.length) {
            if (this.type && SocialTypes[this.type].parseSplit) {
              value = value.split(SocialTypes[this.type].parseSplit)[1];
            } else {
              value = value.split('/');
              value.shift();
              value = value.join('/');
            }
          }
        }
        return value || '';
      }
    ];
    this.outputTransformers = [
      value => (value ? `http://${SocialTypes[this.type].prefix}${value}` : '')
    ];
    this.wrapEvent = false;
  }

  @ViewChild('bInput', { static: true }) bInput: InputComponent;

  @Input() type: Social;
  public readonly iconSize = IconSize;
  public readonly iconColor = IconColor;
  public readonly inputTypes = InputTypes;
  public readonly socialTypes = SocialTypes;

  @Output(FormEvents.socialInputChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  public onInputEvents(event: InputEvent): void {
    if (event.event === InputEventType.onChange) {
      this.writeValue(event.value);
      this.transmitValue(this.value, {
        eventType: [InputEventType.onChange]
      });
    }
    if (
      event.event === InputEventType.onFocus ||
      event.event === InputEventType.onBlur
    ) {
      this.transmitValue(this.value, { eventType: [event.event] });
    }
    if (event.event === InputEventType.onBlur) {
      setTimeout(() => {
        this.bInput.input.nativeElement.value = this.value;
      }, 0);
    }
  }
}

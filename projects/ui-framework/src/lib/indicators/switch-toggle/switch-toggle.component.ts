import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { InputEventType } from '../../form-elements/form-elements.enum';
import { BInputEvent } from '../../form-elements/input/input.interface';

@Component({
  selector: 'b-switch-toggle',
  templateUrl: './switch-toggle.component.html',
  styleUrls: ['./switch-toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchToggleComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SwitchToggleComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: SwitchToggleComponent },
  ],
})
export class SwitchToggleComponent extends BaseFormElement {
  constructor(protected cd: ChangeDetectorRef) {
    super(cd);
    this.wrapEvent = false;
    this.baseValue = false;
  }

  @HostBinding('attr.data-form-element') get isFormElement() {
    return Boolean(
      this.formControlName || this.label || this.placeholder || this.required
    );
  }

  @HostBinding('attr.data-label-in-front') @Input() labelInFront = false;

  @Input() set isChecked(checked: boolean) {
    this.writeValue(Boolean(checked));
  }
  get isChecked() {
    return this.value;
  }

  @Output() switchChange: EventEmitter<MatSlideToggleChange> = new EventEmitter<
    MatSlideToggleChange
  >();

  // tslint:disable-next-line: no-output-rename
  @Output() changed: EventEmitter<BInputEvent<boolean>> = new EventEmitter<
    BInputEvent<boolean>
  >();

  onChange($event: MatSlideToggleChange): void {
    if ($event.checked !== this.value) {
      if (this.switchChange.observers.length) {
        this.switchChange.emit($event);
      }

      this.transmitValue($event.checked, {
        eventType: [InputEventType.onBlur],
        updateValue: true,
      });
    }
  }
}

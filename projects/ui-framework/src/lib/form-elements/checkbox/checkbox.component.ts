import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  SimpleChanges,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';
import { BaseFormElement } from '../base-form-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputEvent } from '../input/input.interface';
import { InputEventType } from '../form-elements.enum';
import { booleanOrFail } from '../../services/utils/transformers';
import { notFirstChanges } from '../../services/utils/functional-utils';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { TruncateTooltipPosition } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { TooltipClass } from '../../popups/tooltip/tooltip.enum';

@Component({
  selector: 'b-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent extends BaseFormElement implements OnChanges {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
    this.inputTransformers = [booleanOrFail];
    this.wrapEvent = false;
    this.baseValue = false;
  }

  @Input() public value = false;
  @Input() public indeterminate = false;

  // tslint:disable-next-line: no-output-rename
  @Output('checkboxChange') changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;
  readonly delay = 300;
  readonly tooltipPosition = TruncateTooltipPosition;
  readonly tooltipClass: TooltipClass[] = [
    TooltipClass.TextLeft,
    TooltipClass.PreWrap,
  ];

  private transmit(event: InputEventType): void {
    this.transmitValue(this.value, {
      eventType: [event],
      addToEventObj: {
        indeterminate: this.indeterminate,
      },
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

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public toggleCheckbox(): void {
    this.value = this.input.nativeElement.checked;
    this.indeterminate = false;
    this.transmit(InputEventType.onBlur);
  }
}

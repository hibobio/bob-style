import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { RadioDirection } from './radio-button.enum';
import { InputEventType } from '../form-elements.enum';
import { RadioConfig } from './radio-button.interface';
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
import { Icons, IconColor, IconSize } from '../../icons/icons.enum';
import {
  TooltipClass,
  TooltipPosition,
} from '../../popups/tooltip/tooltip.enum';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

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
export class RadioButtonComponent extends BaseFormElement
  implements OnChanges, AfterViewInit {
  constructor(cd: ChangeDetectorRef) {
    super(cd);

    this.inputTransformers = [
      valueToObjectKey(this.key),
      objectHasKeyOrFail(this.key),
      (value) => valueInArrayOrFail(value, this.options, this.key),
    ];
    this.outputTransformers = [
      (value: RadioConfig) =>
        !isNullOrUndefined(value) && hasProp(value, 'id')
          ? value.id
          : undefined,
    ];
    this.baseValue = {};
    this.wrapEvent = false;
  }

  @ViewChildren('input', { read: ElementRef })
  public inputs: QueryList<ElementRef>;
  public input: ElementRef<HTMLInputElement>;

  @Input() value: RadioConfig;
  // tslint:disable-next-line: no-input-rename
  @Input('radioConfig') options: RadioConfig[];
  @Input() direction: RadioDirection = RadioDirection.row;

  readonly dir = RadioDirection;
  readonly key = 'id';

  // tslint:disable-next-line: no-output-rename
  @Output('radioChange') changed: EventEmitter<
    InputEvent<number | string>
  > = new EventEmitter<InputEvent<number | string>>();

  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;
  readonly delay = 300;
  readonly tooltipPosition = TooltipPosition;
  readonly tooltipClass: TooltipClass[] = [
    TooltipClass.TextLeft,
    TooltipClass.PreWrap,
  ];
  readonly truncateTooltipType = TruncateTooltipType;

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

  ngAfterViewInit(): void {
    this.input = this.inputs.toArray()[0];
    super.ngAfterViewInit();
  }

  public onRadioChange(id: RadioConfig['id']): void {
    this.writeValue(this.options.find((o) => o[this.key] === id));
    this.transmit(InputEventType.onBlur);
  }

  public trackByID(index: number, item: RadioConfig): string | number {
    return item.id;
  }
}

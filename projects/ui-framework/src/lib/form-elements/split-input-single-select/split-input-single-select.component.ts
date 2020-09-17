import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  forwardRef,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { SelectGroupOption, SelectOption } from '../../lists/list.interface';
import { InputTypes } from '../input/input.enum';
import { InputEventType } from '../form-elements.enum';
import { InputSingleSelectValue } from './split-input-single-select.interface';
import { assign, map } from 'lodash';
import { InputEvent } from '../input/input.interface';
import { ListChange } from '../../lists/list-change/list-change';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { objectHasKeyOrFail } from '../../services/utils/transformers';
import {
  cloneObject,
  isEmptyArray,
  hasChanges,
} from '../../services/utils/functional-utils';
import { InputComponent } from '../input/input.component';

const BSISS_VALUE_DEF = {
  inputValue: null,
  selectValue: null,
};

@Component({
  selector: 'b-split-input-single-select',
  templateUrl: './split-input-single-select.component.html',
  styleUrls: ['./split-input-single-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SplitInputSingleSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SplitInputSingleSelectComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: SplitInputSingleSelectComponent },
  ],
})
export class SplitInputSingleSelectComponent extends BaseFormElement
  implements AfterViewInit {
  constructor(cd: ChangeDetectorRef) {
    super(cd);

    this.inputTransformers = [
      objectHasKeyOrFail(['inputValue', 'selectValue']),
    ];
    this.wrapEvent = false;
    this.baseValue = cloneObject(BSISS_VALUE_DEF);
  }

  @ViewChild('bInput', { static: true }) bInput: InputComponent;
  public input: ElementRef<HTMLInputElement>;

  @Input() value: InputSingleSelectValue = cloneObject(BSISS_VALUE_DEF);
  @Input() inputType: InputTypes;
  @Input() selectOptions: SelectGroupOption[];

  @Input() numberFormat: boolean;
  @Input() onlyIntegers: boolean;

  @Input() selectDisabled = false;

  public selectDisplayValue: string;
  public options: SelectGroupOption[] = [];

  // tslint:disable-next-line: no-output-rename
  @Output('elementChange') changed: EventEmitter<
    InputSingleSelectValue
  > = new EventEmitter<InputSingleSelectValue>();

  // extends BaseFormElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (
      hasChanges(changes, [
        'value',
        'selectOptions',
        'disabled',
        'selectDisabled',
      ])
    ) {
      if (
        this.selectOptions?.length &&
        this.selectOptions[0].options?.length === 1
      ) {
        this.options = null;
        this.selectDisplayValue = this.selectOptions[0].options[0].value;

        return;
      }

      if (
        this.selectOptions?.length &&
        this.selectOptions[0].options?.length &&
        (this.disabled || this.selectDisabled)
      ) {
        this.options = null;
        this.selectDisplayValue = this.selectOptions[0].options.find(
          (o: SelectOption) => o.id === this.value.selectValue || o.selected
        )?.value;

        return;
      }

      this.options = this.selectOptions;
      this.selectDisplayValue = undefined;

      if (
        isEmptyArray(this.options) ||
        isEmptyArray(this.options && this.options[0].options)
      ) {
        this.options = null;
      }
    }
  }

  ngAfterViewInit(): void {
    this.input = this.bInput.input;
    super.ngAfterViewInit();
  }

  onInputChange(event: InputEvent): void {
    if (
      event.event === InputEventType.onChange ||
      event.event === InputEventType.onBlur
    ) {
      this.value.inputValue = event.value;
      this.transmitValue(this.value, {
        eventType: [event.event],
      });
    }
  }

  onSelectChange(listChange: ListChange): void {
    this.value.selectValue = listChange.getSelectedIds()[0];

    this.transmitValue(this.value, {
      eventType: [InputEventType.onBlur],
    });
  }
}

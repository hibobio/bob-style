import {
  Component,
  forwardRef,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Input,
  NgZone,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../base-input-element';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  FormElementKeyboardCntrlService,
  InputCursorState,
} from '../services/keyboard-cntrl.service';
import { InputTypes } from './input.enum';
import { BaseFormElement } from '../base-form-element';
import {
  parseToNumber,
  isNumber,
  countDecimals,
  isNullOrUndefined,
  firstChanges,
  hasChanges,
  isKey,
  isRegExp,
} from '../../services/utils/functional-utils';
import { InputEventType } from '../form-elements.enum';
import { DOMInputEvent } from '../../types';
import { Keys, controlKeys, deleteKeys } from '../../enums';
import { valueAsNumber } from '../../services/utils/transformers';

@Component({
  selector: 'b-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss', './input-number-step-buttons.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: InputComponent },
  ],
})
export class InputComponent extends BaseInputElement implements AfterViewInit {
  constructor(
    cd: ChangeDetectorRef,
    zone: NgZone,
    private kbrdCntrlSrvc: FormElementKeyboardCntrlService,
    private DOM: DOMhelpers
  ) {
    super(cd, zone);

    this.inputTransformers.push(
      (value) =>
        valueAsNumber(this.inputType, value, undefined, this.decimals || 3),

      (value) => {
        return this.inputType === InputTypes.number &&
          this.onlyIntegers &&
          isNumber(value)
          ? Math.round(value)
          : value;
      }
    );
    this.outputTransformers.push((value) =>
      valueAsNumber(this.inputType, value, 0, this.decimals || 3)
    );

    this.forceElementValue = (value: number | string): string => {
      return isNullOrUndefined(value) || value === ''
        ? ''
        : this.inputType === InputTypes.number &&
          this.numberFormat &&
          value !== '-'
        ? this.formatNumberForDisplay(value as number)
        : (value as string);
    };
  }

  @ViewChild('prefix') prefix: ElementRef;
  @ViewChild('suffix') suffix: ElementRef;

  @Input() hasPrefix = false;
  public showPrefix = true;
  @Input() hasSuffix = false;
  public showSuffix = true;

  @Input() numberFormat = false;
  @Input() onlyIntegers = false;
  @Input() decimals = 3;

  @Input('allowedChars') set setAllowedKeys(allowedKeys: string | RegExp) {
    this.allowedKeys = !allowedKeys
      ? null
      : isRegExp(allowedKeys)
      ? allowedKeys
      : new RegExp(`[${allowedKeys}]`.replace(/([\[\]]){2,}/g, '$1'));
  }
  private allowedKeys: RegExp;

  private lastCursorState: InputCursorState = null;

  private numberDisplayFormatter: Intl.NumberFormat;

  onNgChanges(changes: SimpleChanges): void {
    super.onNgChanges(changes);

    if (this.inputType !== InputTypes.number) {
      return;
    }

    if (firstChanges(changes, ['inputType'], true)) {
      this.showCharCounter = Boolean(this.minChars && this.maxChars);
    }

    if (hasChanges(changes, ['inputType', 'maxChars'])) {
      this.maxChars = Math.max(21, this.maxChars || 0);
    }

    if (hasChanges(changes, ['numberFormat', 'onlyIntegers', 'decimals'])) {
      this.numberDisplayFormatter = undefined;
      this.writeValue(this.value);
    }
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.showPrefix = !this.DOM.isEmpty(this.prefix.nativeElement);
        this.showSuffix = !this.DOM.isEmpty(this.suffix.nativeElement);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  public onInputKeydown(event: KeyboardEvent): void {
    if (this.allowedKeys) {
      this.kbrdCntrlSrvc.filterAllowedKeys(event, this.allowedKeys);
    }

    if (this.inputType === InputTypes.number) {
      this.lastCursorState = null;

      if (
        this.kbrdCntrlSrvc.filterAllowedKeys(
          event,
          this.onlyIntegers ? /[0-9-]/ : /[0-9.-]/
        )
      ) {
        return;
      }

      const input = this.input.nativeElement;
      const cursorState = this.kbrdCntrlSrvc.getInputCursorState(input);

      if (
        (event.key === '.' && (!input.value || input.value.includes('.'))) ||
        (event.key === '-' &&
          cursorState.selectionLength !== cursorState.valueLength &&
          (cursorState.selectionStart > 0 || input.value.includes('-')))
      ) {
        event.preventDefault();
        return;
      }

      if (!this.numberFormat) {
        super.onInputKeydown(event);
        return;
      }

      if (
        isKey(event.key, Keys.backspace) &&
        cursorState.prevChar === ',' &&
        !cursorState.selectionLength
      ) {
        event.preventDefault();

        this.kbrdCntrlSrvc.setCursorAtIndex(
          input,
          cursorState.selectionStart - 1
        );

        return;
      }

      if (
        isKey(event.key, Keys.delete) &&
        cursorState.nextChar === ',' &&
        !cursorState.selectionLength
      ) {
        event.preventDefault();

        this.kbrdCntrlSrvc.setCursorAtIndex(
          input,
          cursorState.selectionStart + 1
        );

        return;
      }

      if (
        !controlKeys.includes(event.key as Keys) ||
        deleteKeys.includes(event.key as Keys)
      ) {
        this.lastCursorState = {
          ...cursorState,

          positionMod:
            (isKey(event.key, Keys.delete)
              ? cursorState.selectionLength + 1
              : cursorState.selectionLength) -
            (cursorState.selectionLength === cursorState.valueLength
              ? 0
              : cursorState.selection.split(',').length - 1),
        };
      }
    }

    super.onInputKeydown(event);
  }

  public onInputChange(event: DOMInputEvent): void {
    if (this.inputType !== InputTypes.number || !this.numberFormat) {
      super.onInputChange(event);
      return;
    }

    if (event.data !== '.' && event.data !== '0') {
      super.onInputChange(event);

      if (this.lastCursorState !== null) {
        const input = this.input.nativeElement;
        this.kbrdCntrlSrvc.setCursorAtIndex(
          input,
          this.lastCursorState.selectionStart +
            (input.value.length - this.lastCursorState.valueLength) +
            this.lastCursorState.positionMod
        );
        this.lastCursorState = null;
      }
    } else {
      super.onInputChange(event, false);
    }
  }

  public onInputBlur(event: FocusEvent = null) {
    if (this.inputType === InputTypes.number && (this.value + '').length) {
      this.processNumberValue(this.value, false, false);
    }

    const relatedTarget = event.relatedTarget as HTMLButtonElement;

    if (
      this.inputType !== InputTypes.number ||
      !relatedTarget ||
      (relatedTarget && !relatedTarget.classList.contains('step-button'))
    ) {
      super.onInputBlur(event);
    }
  }

  public onIncrement() {
    this.processNumberValue(
      parseToNumber(this.input.nativeElement.value) + parseToNumber(this.step),
      true,
      true
    );
    this.focus(true);
  }

  public onDecrement() {
    this.processNumberValue(
      parseToNumber(this.input.nativeElement.value) - parseToNumber(this.step),
      true,
      true
    );
    this.focus(true);
  }

  private checkMinMax(value: number): number {
    return isNumber(this.min) && value < this.min
      ? this.min
      : isNumber(this.max) && value > this.max
      ? this.max
      : value;
  }

  private processNumberValue(
    value: number | string = this.value,
    round = false,
    emit = false
  ): void {
    const valueUpd = this.checkMinMax(
      parseToNumber(
        value,
        round && !isNullOrUndefined(this.step) ? countDecimals(this.step) : null
      )
    );

    // tslint:disable-next-line: triple-equals
    if (valueUpd != this.value) {
      this.writeValue(valueUpd);

      if (emit) {
        this.transmitValue(this.value, {
          eventType: [InputEventType.onChange],
        });
      }
    }
  }

  private formatNumberForDisplay(number: number): string {
    return (
      this.numberDisplayFormatter ||
      (this.numberDisplayFormatter = new Intl.NumberFormat('en', {
        style: 'decimal',
        useGrouping: true,
        maximumFractionDigits: this.decimals || 3,
      }))
    ).format(number);
  }
}

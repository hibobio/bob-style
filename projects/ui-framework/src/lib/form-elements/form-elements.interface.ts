import {
  InputEventType,
  FormEvents,
  FormElementSize,
} from './form-elements.enum';
import { ValidatorFn, FormControl, ValidationErrors } from '@angular/forms';
import { Func } from '../services/utils/functional-utils';
import { InputTypes, InputAutoCompleteOptions } from './input/input.enum';
import { ElementRef, SimpleChanges } from '@angular/core';
import { SelectGroupOption, ListFooterActions } from '../lists/list.interface';
import { SelectMode } from '../lists/list.enum';
import { TruncateTooltipType } from '../popups/truncate-tooltip/truncate-tooltip.enum';

export interface TransmitOptions {
  eventType: InputEventType[];
  emitterName?: FormEvents;
  doPropagate?: boolean;
  addToEventObj?: { [key: string]: any };
  eventObjValueKey?: string;
  eventObjOmitEventType?: boolean;
  updateValue?: boolean;
}

export type ForceElementValue = any | ((v: any) => any);

export interface FormElementSpec {
  id: string;
  getElementIDdata: () => string;
  value: any;
  baseValue: any;
  disabled: boolean;
  required: boolean;
  readonly: boolean;
  label: string;
  description: string;
  placeholder: string;
  hintMessage: string;
  errorMessage: string;
  warnMessage: string;
  focus: (skipFocusEvent: boolean) => void;
  writeValue: (value: any, arg: any) => void;
  transmitValue: (value: any, options: Partial<TransmitOptions>) => void;
  ngOnChanges: (changes: SimpleChanges) => void;
  onNgChanges: (changes: SimpleChanges) => void;
  ignoreEvents: InputEventType[];
  wrapEvent: boolean;
  validateFn: ValidatorFn;
  propagateChange: Function;
  registerOnChange: Function;
  registerOnTouched: Function;
  setDisabledState: (isDisabled: boolean) => void;
  validate: (c: FormControl) => ValidationErrors;
  onTouched: Function;
  doPropagate: boolean;
  size: FormElementSize;
  hideLabelOnFocus: boolean;
  enableBrowserAutoComplete?: InputAutoCompleteOptions;
  showCharCounter: boolean;
  focusOnInit: boolean;
  inputTransformers: Func[];
  outputTransformers: Func[];
  inputType?: InputTypes;
  step?: number;
  minChars?: number;
  maxChars?: number;
  min?: number;
  max?: number;
  input: ElementRef<HTMLInputElement>;
  onInputChange?: (event: any, forceElementValue?: any) => void;
  onInputFocus?: (event: FocusEvent) => void;
  onInputBlur?: (event: FocusEvent) => void;
  onInputKeydown?: (event: KeyboardEvent) => void;
  options?: SelectGroupOption[];
  optionsDefault?: SelectGroupOption[];
  mode?: SelectMode;
  type?: any;
  hasPrefix?: boolean;
  showSingleGroupHeader?: boolean;
  startWithGroupsCollapsed?: boolean;
  tooltipType?: TruncateTooltipType;
  listActions?: ListFooterActions;
  touched?: boolean;
  dirty?: boolean;
  [key: string]: any;
}

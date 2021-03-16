import {
  Input,
  HostBinding,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Directive,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import {
  simpleUID,
  asArray,
  isNullOrUndefined,
  cloneValue,
  applyChanges,
  notFirstChanges,
  chainCall,
  Func,
  cloneArray,
  stringify,
  isFunction,
  isObject,
  objectRemoveEntriesByValue,
  objectRemoveKeys,
  unsubscribeArray,
} from '../services/utils/functional-utils';
import { InputEventType, FormElementSize } from './form-elements.enum';
import {
  TransmitOptions,
  ForceElementValue,
  FormElementSpec,
} from './form-elements.interface';
import { IGNORE_EVENTS_DEF, TRANSMIT_OPTIONS_DEF } from './form-elements.const';
import { InputAutoCompleteOptions, InputTypes } from './input/input.enum';
import { Subscription } from 'rxjs/internal/Subscription';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseFormElement
  implements
    ControlValueAccessor,
    FormElementSpec,
    OnChanges,
    AfterViewInit,
    OnDestroy {
  protected constructor(protected cd: ChangeDetectorRef) {}

  @ViewChild('input', { static: true, read: ElementRef })
  public input: ElementRef<HTMLInputElement>;

  @Input() id: string = simpleUID('bfe');
  @Input() label: string;
  @Input() description: string;
  @Input() placeholder: string;
  @Input() value: any;
  @Input() hideLabelOnFocus = false;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() warnMessage: string;
  @Input() doPropagate = true;
  @Input() ignoreEvents: InputEventType[] = cloneArray(IGNORE_EVENTS_DEF);
  @Input() formControlName: string;
  @Input() showCharCounter = true;
  @Input() focusOnInit = false;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;

  @Input() set isDisabled(disabled: boolean) {
    this.disabled = Boolean(disabled);
  }
  get isDisabled() {
    return this.disabled;
  }

  @Input('spec') set setProps(spec: FormElementSpec) {
    if (isObject(spec)) {
      const errorProps: string[] = [
        'value',
        'options',
        'optionsDefault',
      ].filter((p) => spec[p]);

      if (errorProps.length) {
        console.error(
          `[BaseFormElement.spec]: <${errorProps}> ${
            errorProps.length > 1 ? 'are' : 'is'
          } not allowed in [spec] input and should be ${
            errorProps.length > 1 ? '' : 'a'
          } separate binding${errorProps.length > 1 ? 's' : ''}`
        );
      }
      Object.assign(
        this,
        objectRemoveKeys(
          objectRemoveEntriesByValue(spec, [undefined]),
          errorProps
        )
      );
    }
  }

  public inputFocused: boolean | boolean[] = false;
  public inputTransformers: Func[] = [];
  public outputTransformers: Func[] = [];
  public baseValue: any;
  public wrapEvent = true;
  protected writingValue = false;
  protected skipFocusEvent = false;
  protected forceElementValue: ForceElementValue = false;
  readonly inputTypes = InputTypes;

  readonly subs: Subscription[] = [];

  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('attr.data-size') @Input() size = FormElementSize.regular;
  @HostBinding('class.disabled') @Input() disabled = false;
  @HostBinding('class.required') @Input() required = false;
  @HostBinding('class.readonly') @Input() readonly = false;
  @HostBinding('class.error') get hasError(): boolean {
    return this.errorMessage && !this.disabled;
  }
  @HostBinding('class.warn') get hasWarn(): boolean {
    return this.warnMessage && !this.errorMessage && !this.disabled;
  }
  @HostBinding('class.has-label') get hasLabel(): boolean {
    return this.label && !this.hideLabelOnFocus;
  }
  @HostBinding('class.has-message') get hasMessage(): boolean {
    return (
      !!this.hintMessage ||
      (this.errorMessage && !this.disabled) ||
      (this.warnMessage && !this.disabled)
    );
  }

  public onNgChanges(changes: SimpleChanges): void {}

  @Input() validateFn: ValidatorFn = (_: FormControl) =>
    // tslint:disable-next-line: semicolon
    ({} as ValidationErrors);

  onTouched: Function = (_: any) => {};

  propagateChange: Function = (_: any) => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(c: FormControl): ValidationErrors {
    return this.validateFn(c);
  }

  public writeValue(
    value: any,
    forceElementValue: ForceElementValue = this.forceElementValue
  ): void {
    this.writingValue = true;

    if (value !== undefined) {
      try {
        this.value = chainCall(this.inputTransformers, value);
      } catch (error) {
        console.error(`${this.getElementIDdata()} threw an error:\n`, error);
        return;
      }
    }

    if (
      (value === undefined || isNullOrUndefined(this.value)) &&
      this.baseValue !== undefined
    ) {
      this.value = cloneValue(this.baseValue);
    }

    this.cd.detectChanges();

    if (
      (forceElementValue === true || isFunction(forceElementValue)) &&
      ['INPUT', 'TEXTAREA'].includes(
        this.input?.nativeElement?.nodeName.toUpperCase()
      )
    ) {
      this.input.nativeElement.value = isFunction(forceElementValue)
        ? forceElementValue(this.value)
        : this.value;
    }

    this.writingValue = false;
  }

  public transmitValue(
    value: any = this.value,
    options: Partial<TransmitOptions> = {}
  ): void {
    options = {
      ...TRANSMIT_OPTIONS_DEF,
      doPropagate: this.doPropagate,
      ...options,
    };
    const {
      eventType,
      emitterName,
      doPropagate,
      addToEventObj,
      eventObjValueKey,
      eventObjOmitEventType,
      updateValue,
    } = options;

    // If value is undefined, it will not be transmitted.
    // Transformers may intentionally set value to undefined,
    // to prevent transmission
    if (
      value !== undefined &&
      (doPropagate || updateValue || this[emitterName].observers.length > 0)
    ) {
      value = chainCall(this.outputTransformers, value);

      if (value === undefined && this.baseValue !== undefined) {
        value = cloneValue(this.baseValue);
      }
      if (updateValue) {
        this.value = value;
      }

      const allowedEvents = asArray(eventType).filter(
        (event) => !this.ignoreEvents.includes(event)
      );

      if (emitterName && this[emitterName].observers.length > 0) {
        allowedEvents.forEach((event) => {
          this[emitterName].emit(
            this.wrapEvent
              ? {
                  ...(!eventObjOmitEventType && { event }),
                  [eventObjValueKey]: value,
                  ...addToEventObj,
                }
              : value
          );
        });
      }

      if (
        doPropagate &&
        allowedEvents.filter((event) => event !== InputEventType.onFocus)
          .length > 0
      ) {
        this.propagateChange(value);
      }

      if (doPropagate && allowedEvents.includes(InputEventType.onBlur)) {
        this.onTouched();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        showCharCounter: true,
        ignoreEvents: cloneArray(IGNORE_EVENTS_DEF),
        enableBrowserAutoComplete: InputAutoCompleteOptions.off,
      },
      ['value', 'options', 'setProps'],
      false,
      { keyMap: { disabled: 'isDisabled' } }
    );

    if (changes.value || changes.setProps?.currentValue?.value !== undefined) {
      this.writeValue(
        changes.value
          ? changes.value.currentValue
          : changes.setProps.currentValue.value
      );
      this.transmitValue(this.value, { eventType: [InputEventType.onWrite] });
    }

    this.onNgChanges(changes);

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    if (this.focusOnInit) {
      this.focus();
    }
  }

  public focus(skipFocusEvent = false): void {
    this.skipFocusEvent = skipFocusEvent;
    if (this.input && this.input.nativeElement) {
      this.input.nativeElement.focus();
    }
  }

  public getElementIDdata(): string {
    return `[${
      this.formControlName ? 'formControl: ' + this.formControlName + ', ' : ''
    }element id: ${this.id}${
      this.value ? ', value: ' + stringify(this.value) : ''
    }]`;
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);
    this['subscribtions'] && unsubscribeArray(this['subscribtions']);
  }
}

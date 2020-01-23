import {
  Component,
  forwardRef,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Input,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../base-input-element';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';
import { InputTypes } from './input.enum';
import { BaseFormElement } from '../base-form-element';
import { parseToNumber } from '../../services/utils/functional-utils';
import { InputEventType } from '../form-elements.enum';

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
    kbrdCntrlSrvc: FormElementKeyboardCntrlService,
    private DOM: DOMhelpers
  ) {
    super(cd, zone, kbrdCntrlSrvc);
  }

  @ViewChild('prefix', { static: false }) prefix: ElementRef;
  @ViewChild('suffix', { static: false }) suffix: ElementRef;

  @Input() hasPrefix = false;
  public showPrefix = true;
  @Input() hasSuffix = false;
  public showSuffix = true;

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

  public onInputBlur(event: FocusEvent = null) {
    if (this.inputType === InputTypes.number && (this.value + '').length) {
      this.processNumberValue(this.value);
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
      parseToNumber(this.input.nativeElement.value) + this.step,
      true
    );
    this.focus(true);
  }

  public onDecrement() {
    this.processNumberValue(
      parseToNumber(this.input.nativeElement.value) - this.step,
      true
    );
    this.focus(true);
  }

  private checkMinMax(value: number | string): number {
    const parsed = parseToNumber(value);

    return this.min && parsed < this.min
      ? this.min
      : this.max && parsed > this.max
      ? this.max
      : parsed;
  }

  private processNumberValue(value = this.value, emit = false): void {
    const valueUpd = this.checkMinMax(value);

    // tslint:disable-next-line: triple-equals
    if (valueUpd != this.value) {
      this.writeValue(valueUpd, true);

      if (emit) {
        this.transmitValue(this.value, {
          eventType: [InputEventType.onChange],
        });
      }
    }
  }
}

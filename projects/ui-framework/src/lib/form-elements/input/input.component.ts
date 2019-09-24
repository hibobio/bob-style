import {
  Component,
  forwardRef,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Input,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../base-input-element';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';
import { InputTypes } from './input.enum';

@Component({
  selector: 'b-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent extends BaseInputElement implements AfterViewInit {
  constructor(
    private DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef,
    kbrdCntrlSrvc: FormElementKeyboardCntrlService
  ) {
    super(zone, cd, kbrdCntrlSrvc);
  }

  @ViewChild('input', { static: true }) input: ElementRef;
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

  public onInputKeydown(event: KeyboardEvent) {
    if (this.inputType === InputTypes.number) {
      this.kbrdCntrlSrvc.filterAllowedKeys(event, /[0-9.]/);
    }
  }
}

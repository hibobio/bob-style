import {
  Component,
  forwardRef,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Input
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../base-input-element';

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
  constructor() {
    super();
  }
  @ViewChild('input') input: ElementRef;
  @ViewChild('prefix') prefix: ElementRef;
  @ViewChild('suffix') suffix: ElementRef;

  @Input() hasPrefix = false;
  @Input() hasSuffix = false;
  public showPrefix = true;
  public showSuffix = true;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showPrefix =
        this.hasPrefix || this.prefix.nativeElement.childNodes.length > 0;
      this.showSuffix =
        this.hasSuffix || this.suffix.nativeElement.childNodes.length > 0;
    }, 0);
  }
}

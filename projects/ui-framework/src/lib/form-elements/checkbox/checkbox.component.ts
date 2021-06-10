import { filter } from 'rxjs/operators';

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { clickKeys, Keys } from '../../enums';
import { ICON_CONFIG } from '../../icons/common-icons.const';
import { Icon } from '../../icons/icon.interface';
import {
  TooltipClass,
  TooltipPosition,
} from '../../popups/tooltip/tooltip.enum';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { notFirstChanges } from '../../services/utils/functional-utils';
import { booleanOrFail } from '../../services/utils/transformers';
import { UtilsService } from '../../services/utils/utils.service';
import { BaseFormElement } from '../base-form-element';
import { InputEventType } from '../form-elements.enum';
import { BInputEvent } from '../input/input.interface';

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
    { provide: BaseFormElement, useExisting: CheckboxComponent },
  ],
})
export class CheckboxComponent extends BaseFormElement implements OnChanges {
  constructor(
    cd: ChangeDetectorRef,
    private zone: NgZone,
    private utilsService: UtilsService
  ) {
    super(cd);
    this.inputTransformers = [booleanOrFail];
    this.wrapEvent = false;
    this.baseValue = false;

    this.subs.push(
      this.utilsService
        .getWindowKeydownEvent(true)
        .pipe(
          filter((event) => {
            const target = event.target;
            return (
              clickKeys.includes(event.key as Keys) &&
              target.matches(`label[for="${this.id}"],input[id="${this.id}"]`)
            );
          })
        )
        .subscribe((event) => {
          event.preventDefault();
          this.zone.run(() => {
            this.toggleCheckbox(!this.input.nativeElement.checked);
          });
        })
    );
  }

  @Input() public value = false;
  @Input() public indeterminate = false;

  // tslint:disable-next-line: no-output-rename
  @Output('checkboxChange') changed: EventEmitter<
    BInputEvent<boolean>
  > = new EventEmitter();

  readonly delay = 300;
  readonly tooltipPosition = TooltipPosition;
  readonly tooltipClass: TooltipClass[] = [
    TooltipClass.TextLeft,
    TooltipClass.PreWrap,
  ];
  readonly truncateTooltipType = TruncateTooltipType;

  readonly infoIcn: Icon = ICON_CONFIG.info;

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

  public toggleCheckbox(value: boolean = null): void {
    this.value =
      value === null
        ? this.input.nativeElement.checked
        : (this.input.nativeElement.checked = value);
    this.indeterminate = false;
    this.transmit(InputEventType.onBlur);
  }
}

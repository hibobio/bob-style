import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  SimpleChanges,
  ChangeDetectorRef,
  OnChanges,
  NgZone,
} from '@angular/core';
import { BaseFormElement } from '../base-form-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BInputEvent } from '../input/input.interface';
import { InputEventType } from '../form-elements.enum';
import { booleanOrFail } from '../../services/utils/transformers';
import { notFirstChanges } from '../../services/utils/functional-utils';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import {
  TooltipClass,
  TooltipPosition,
} from '../../popups/tooltip/tooltip.enum';
import { clickKeys, Keys } from '../../enums';
import { UtilsService } from '../../services/utils/utils.service';
import { filter } from 'rxjs/operators';

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
            const target = event.target as HTMLElement;
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
  > = new EventEmitter<BInputEvent<boolean>>();

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

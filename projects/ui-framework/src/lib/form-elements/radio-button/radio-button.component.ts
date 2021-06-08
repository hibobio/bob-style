import { filter } from 'rxjs/operators';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { arrowKeys, clickKeys, Keys } from '../../enums';
import { ICON_CONFIG } from '../../icons/common-icons.const';
import { Icon } from '../../icons/icon.interface';
import {
  TooltipClass,
  TooltipPosition,
} from '../../popups/tooltip/tooltip.enum';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { DOMtags } from '../../services/html/dom-helpers.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  getEventPath,
  hasProp,
  isNullOrUndefined,
  notFirstChanges,
} from '../../services/utils/functional-utils';
import {
  objectHasKeyOrFail,
  valueInArrayOrFail,
  valueToObjectKey,
} from '../../services/utils/transformers';
import { UtilsService } from '../../services/utils/utils.service';
import { BaseFormElement } from '../base-form-element';
import { InputEventType } from '../form-elements.enum';
import { BInputEvent } from '../input/input.interface';
import { RadioDirection } from './radio-button.enum';
import { RadioConfig } from './radio-button.interface';

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
    { provide: BaseFormElement, useExisting: RadioButtonComponent },
  ],
})
export class RadioButtonComponent
  extends BaseFormElement
  implements OnChanges, AfterViewInit {
  constructor(
    cd: ChangeDetectorRef,
    private zone: NgZone,
    private utilsService: UtilsService,
    private DOM: DOMhelpers,
    public hostElRef: ElementRef<HTMLElement>
  ) {
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

    const controlKeys = clickKeys.concat(arrowKeys);

    this.subs.push(
      this.utilsService
        .getWindowKeydownEvent(true)
        .pipe(
          filter((event) => {
            const target = event.target;
            return (
              controlKeys.includes(event.key as Keys) &&
              getEventPath(event).includes(this.hostElRef.nativeElement) &&
              target.matches(`label,input`)
            );
          })
        )
        .subscribe((event) => {
          event.preventDefault();
          const target = event.target;
          const isInput = this.DOM.isTag(target, DOMtags.input);
          this.zone.run(() => {
            if (clickKeys.includes(event.key as Keys)) {
              target.click();
            }
            if ([Keys.arrowdown, Keys.arrowleft].includes(event.key as Keys)) {
              this.DOM.getPrevSibling(
                target,
                isInput ? 'input' : 'label'
              )?.focus();
            }
            if ([Keys.arrowup, Keys.arrowright].includes(event.key as Keys)) {
              this.DOM.getNextSibling(
                target,
                isInput ? 'input' : 'label'
              )?.focus();
            }
          });
        })
    );
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
    BInputEvent<number | string>
  > = new EventEmitter();

  readonly infoIcn: Icon = ICON_CONFIG.info;

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

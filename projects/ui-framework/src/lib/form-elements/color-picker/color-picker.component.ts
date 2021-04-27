import { ColorPickerDirective } from 'ngx-color-picker';

import { CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { LIST_ACTIONS_STATE_DEF } from '../../lists/list-footer/list-footer.const';
import {
  ListPanelService,
  OverlayEnabledComponent,
} from '../../lists/list-panel.service';
import { ListFooterActionsState } from '../../lists/list.interface';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';
import { Panel } from '../../popups/panel/panel.interface';
import { ColorsGrey } from '../../services/color-service/color-palette.enum';
import {
  cloneDeepSimpleObject,
  isDark,
<<<<<<< HEAD
  isString,
=======
>>>>>>> Pavel/ more work on color-picker (#2068)
  setCssProps,
} from '../../services/utils/functional-utils';
import { hexifyColor } from '../../services/utils/transformers';
import { DOMInputEvent, OverlayPositionClasses } from '../../types';
import { BaseFormElement } from '../base-form-element';
import { InputEventType } from '../form-elements.enum';
import { TransmitOptions } from '../form-elements.interface';
<<<<<<< HEAD
import { COLOR_PICKER_DEFAULT, HEX_REGEX } from './color-picker.const';
=======
import { HEX_REGEX } from './color-picker.const';
>>>>>>> Pavel/ more work on color-picker (#2068)
import { ColorPickerConfig } from './color-picker.interface';

@Component({
  selector: 'b-colorpicker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: ColorPickerComponent },
  ],
})
export class ColorPickerComponent extends BaseFormElement
  implements OnChanges, OnDestroy, OverlayEnabledComponent {
  constructor(
    public cd: ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef,
    private listPanelService: ListPanelService,
    protected translate: TranslateService,
    private hostElRef: ElementRef<HTMLElement>
  ) {
    super(cd);
    this.lastEmittedValue = this.baseValue = null;
    this.placeholder = this.translate.instant('common.select');
    this.wrapEvent = false;
<<<<<<< HEAD

    this.forceElementValue = (color: string, slice = true) =>
      color === this.baseValue
        ? null
        : (!slice
            ? color
            : color?.slice(
                0,
                this.input?.nativeElement.value?.length || undefined
              )) || null;

    this.isNullColor = (color) =>
      color?.length > 1 &&
      !color?.replace(new RegExp(this.nullColor.replace('#', '#|'), 'gi'), '');

    this.nullifyColor = (color: string) =>
      !HEX_REGEX.test(color) ||
      ((!this.value || this.value === this.baseValue) &&
        this.isNullColor(color))
        ? this.baseValue
        : color;

    this.inputTransformers = [
      (color: string) =>
        color === COLOR_PICKER_DEFAULT ? this.baseValue : color,
      hexifyColor,
      this.nullifyColor,
    ];
=======

    this.forceElementValue = (color: string, slice = true) =>
      (!slice
        ? color
        : color?.slice(
            0,
            this.input?.nativeElement.value?.length || undefined
          )) || null;

    this.isNullColor = (color) =>
      color?.length > 1 &&
      !color?.replace(new RegExp(this.nullColor.replace('#', '#|'), 'gi'), '');

    this.nullifyColor = (color: string) =>
      !HEX_REGEX.test(color) || (!this.value && this.isNullColor(color))
        ? this.baseValue
        : color;

    this.inputTransformers = [hexifyColor, this.nullifyColor];
>>>>>>> Pavel/ more work on color-picker (#2068)
    this.outputTransformers = [this.nullifyColor];
  }

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;

  @ViewChild(ColorPickerDirective) clrp: ColorPickerDirective;

  @Input() value: string;

  @Input() config: ColorPickerConfig;

  public panel: Panel;
  public panelOpen = false;
  public panelPosition = PanelDefaultPosVer.belowLeftRight;
  public panelClassList: string[] = ['b-select-panel'];
  public positionClassList: OverlayPositionClasses = {};
  public colorPickerWidth: number;
  public listActionsState: ListFooterActionsState = cloneDeepSimpleObject(
    LIST_ACTIONS_STATE_DEF
  );

  public nullColor = '#fff';
  readonly resetIcon = {
    icon: Icons.reset_x,
    size: IconSize.small,
    color: IconColor.normal,
    hasHoverState: true,
  };

  public lastEmittedValue: string;
  public isTyping = false;
  private isNullColor: (c: string) => boolean;
  private nullifyColor: (c: string) => string;

  public get overlayRef(): OverlayRef {
    return this.panel?.overlayRef;
  }

  ngOnChanges(changes: SimpleChanges): void {
<<<<<<< HEAD
    if (changes.config?.currentValue?.defaultValue !== undefined) {
      this.lastEmittedValue = this.baseValue = isString(
        changes.config.currentValue.defaultValue
      )
        ? changes.config.currentValue.defaultValue
        : null;

      this.nullColor = HEX_REGEX.test(this.baseValue) ? this.baseValue : '#fff';
    }

    if (changes.value) {
      this.lastEmittedValue = changes.value.currentValue;
    }

    super.ngOnChanges(changes);
  }

  public writeValue(color: string, slice = true): void {
    if (this.value !== color) {
      this.listActionsState.apply.disabled = false;
      this.listActionsState.clear.hidden = !color || this.isNullColor(color);
    }

    this.setColorVars(color);
    super.writeValue(color, this.forceElementValue, slice);
  }

  public transmitValue(
    color: string,
    options: Partial<TransmitOptions> = {}
  ): void {
    this.writeValue(color, (this.isTyping = false));

    this.listActionsState.apply.disabled = true;

=======
    if (changes.value) {
      this.lastEmittedValue = changes.value.currentValue;
    }

    super.ngOnChanges(changes);
  }

  public writeValue(color: string, slice = true): void {
    if (this.value !== color) {
      this.listActionsState.apply.disabled = false;
      this.listActionsState.clear.hidden = !color;
    }

    this.setColorVars(color);
    super.writeValue(color, this.forceElementValue, slice);
  }

  public transmitValue(
    color: string,
    options: Partial<TransmitOptions> = {}
  ): void {
    this.writeValue(color, (this.isTyping = false));

    this.listActionsState.apply.disabled = true;

>>>>>>> Pavel/ more work on color-picker (#2068)
    if (color !== this.lastEmittedValue) {
      super.transmitValue((this.lastEmittedValue = color), {
        eventType: [InputEventType.onBlur],
        ...options,
      });
    }
  }

  public onInputChange(event: DOMInputEvent): void {
    this.isTyping = true;

    if (!this.panel) {
      this.openPanel();
    }

    event.target.value =
      (event.target.value !== '#'
        ? hexifyColor(event.target.value)
        : event.target.value) || null;

<<<<<<< HEAD
    if (
      this.isNullColor(event.target.value) &&
      (!this.value || this.value === this.baseValue)
    ) {
=======
    if (this.isNullColor(event.target.value) && !this.value) {
>>>>>>> Pavel/ more work on color-picker (#2068)
      this.writeValue((this.value = event.target.value));
    }

    if (event.target.value) {
      this.clrp?.inputChange(event);
    } else {
      this.clearInput();
    }
  }

  public clearInput(): void {
    if (
      this.panel &&
      (this.config?.showFooter !== false || !this.config?.emitOnChange)
    ) {
<<<<<<< HEAD
      this.writeValue(this.baseValue);
    } else {
      this.transmitValue(this.baseValue);
=======
      this.writeValue(null);
    } else {
      this.transmitValue(null);
>>>>>>> Pavel/ more work on color-picker (#2068)
    }
  }

  public onColorPickerChange(color: string): void {
    if (this.config?.emitOnChange && this.config?.showFooter === false) {
      this.transmitValue(color);
    } else {
      this.writeValue(color, this.isTyping);
    }
  }

  public colorPickerClose(color: string): void {
    this.config?.showFooter === false &&
      this.transmitValue(this.nullifyColor(color));
  }

  public onApply(): void {
    this.transmitValue(this.value);
    this.closePanel();
  }

  public onCancel(): void {
    this.writeValue((this.value = this.lastEmittedValue));
    this.listActionsState.apply.disabled = true;
    this.closePanel();
  }

  private setColorPickerWidth(): void {
<<<<<<< HEAD
    const hostWidth = this.hostElRef?.nativeElement.offsetWidth;

    if (hostWidth <= 140) {
      (this.config || (this.config = {})).showClearButton = false;
    }

    // $b-select-panel-min-width: 280px;
    this.colorPickerWidth = Math.max(
      280,
      hostWidth || this.colorPickerWidth || 0
    );

=======
    // $b-select-panel-min-width: 280px;
    this.colorPickerWidth = Math.max(
      280,
      this.hostElRef?.nativeElement.offsetWidth || this.colorPickerWidth || 0
    );
>>>>>>> Pavel/ more work on color-picker (#2068)
    this.cd.detectChanges();
  }

  private setColorVars(color: string): void {
    const avatarBorderColor = isDark(color, 200)
      ? 'transparent'
      : ColorsGrey.color_grey_500;
    const cursorColor = isDark(color, 80)
      ? ColorsGrey.color_grey_500
      : ColorsGrey.color_grey_800;

    setCssProps(this.hostElRef.nativeElement, {
      '--circle-border-color': avatarBorderColor,
    });

    this.panel &&
      setCssProps(
        this.panel.overlayRef.overlayElement.children[0] as HTMLElement,
        {
          '--circle-border-color': avatarBorderColor,
          '--cursor-border-color': cursorColor,
        }
      );
  }

  public openPanel(): void {
<<<<<<< HEAD
    this.listActionsState.clear.hidden =
      !this.value || this.value === this.baseValue;
=======
    this.listActionsState.clear.hidden = !this.value;
>>>>>>> Pavel/ more work on color-picker (#2068)
    this.setColorPickerWidth();

    this.panel = this.listPanelService.openPanel({ self: this });
    this.setColorVars(this.value);
  }

  public closePanel(): void {
    this.input?.nativeElement.blur();
    this.destroyPanel();
  }

  private destroyPanel(skipEmit = false): void {
    this.panel = this.listPanelService.destroyPanel({ self: this, skipEmit });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroyPanel(true);
  }
}

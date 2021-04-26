import { ColorPickerDirective } from 'ngx-color-picker';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

import { CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import {
  ListPanelService,
  OverlayEnabledComponent,
} from '../../lists/list-panel.service';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';
import { Panel } from '../../popups/panel/panel.interface';
import { distinctFrom } from '../../services/utils/rxjs.operators';
import { DOMInputEvent, OverlayPositionClasses } from '../../types';
import { BaseFormElement } from '../base-form-element';
import { InputEventType } from '../form-elements.enum';
import { COLOR_PICKER_DEFAULT } from './color-picker.const';

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
  implements OnInit, OnDestroy, OverlayEnabledComponent {
  constructor(
    public cd: ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef,
    private listPanelService: ListPanelService
  ) {
    super(cd);
    this.baseValue = null;
    this.placeholder = COLOR_PICKER_DEFAULT;
    this.wrapEvent = false;
    this.forceElementValue = true;

    this.inputTransformers = [
      (value) =>
        /^#(?:[0-9a-fA-F]{3}){1,2}$/i.test(value) ? value : this.baseValue,
    ];
  }

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;

  @ViewChild(ColorPickerDirective) clrp: ColorPickerDirective;

  public panel: Panel;
  public panelOpen = false;
  public panelPosition = PanelDefaultPosVer.belowLeftRight;
  public panelClassList: string[] = ['b-select-panel'];
  public positionClassList: OverlayPositionClasses = {};

  readonly nullColor = '#fff';
  readonly resetIcon = {
    icon: Icons.reset_x,
    size: IconSize.small,
    color: IconColor.normal,
    hasHoverState: true,
  };
  public colorPickerWidth: number;

  private clrpChanges$ = new Subject<string>();
  private sub: Subscription;
  private lastEmittedValue: string;

  public get overlayRef(): OverlayRef {
    return this.panel?.overlayRef;
  }

  ngOnInit(): void {
    //
    this.sub = this.clrpChanges$
      .pipe(
        debounceTime(100),

        map((color) =>
          !this.value && color?.includes(this.nullColor) ? null : color
        ),

        tap((color) => {
          this.writeValue(color);
        }),

        distinctFrom(() => this.lastEmittedValue)
      )
      .subscribe((color) => {
        this.transmitValue((this.lastEmittedValue = color), {
          eventType: [InputEventType.onBlur],
        });
      });
  }

  public onInputChange(event: DOMInputEvent): void {
    if (!this.panel) {
      this.openPanel();
    }

    event.target.value = event.target.value
      ? `#${event.target.value.replace('#', '')}`
      : null;

    if (event.target.value?.includes(this.nullColor) && !this.value) {
      this.value = event.target.value;
      this.onColorPickerChange(event.target.value);
    } else if (event.target.value) {
      this.clrp?.inputChange(event);
    } else {
      this.clearInput();
    }
  }

  public clearInput(): void {
    this.value = null;
    if (this.panel) {
      this.clrp?.inputChange({ target: { value: this.nullColor } });
    } else {
      this.onColorPickerChange(null);
    }
  }

  public onColorPickerChange(color: string): void {
    this.clrpChanges$.next(color);
  }

  private setColorPickerWidth(
    width: number = this.overlayOrigin?.elementRef.nativeElement.offsetWidth
  ): void {
    // $b-select-panel-min-width: 280px;
    this.colorPickerWidth = Math.max(280, width || this.colorPickerWidth || 0);
    this.cd.detectChanges();
  }

  public openPanel(): void {
    this.setColorPickerWidth();
    this.panel = this.listPanelService.openPanel({ self: this });
  }

  public closePanel(): void {
    this.destroyPanel();
  }

  private destroyPanel(skipEmit = false): void {
    this.panel = this.listPanelService.destroyPanel({ self: this, skipEmit });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroyPanel(true);
    this.sub?.unsubscribe();
    this.clrpChanges$.complete();
  }
}

import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element'
import { DOMInputEvent, OverlayPositionClasses } from '../../types';
import { InputEventType } from '../form-elements.enum';
import { Panel } from '../../popups/panel/panel.interface';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';
import { ListPanelService, OverlayEnabledComponent } from '../../lists/list-panel.service';
import { CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
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
export class ColorPickerComponent extends BaseFormElement implements OnDestroy, OverlayEnabledComponent {
  constructor(
    public cd: ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef,
    private listPanelService: ListPanelService,
    private translateService: TranslateService,
  ) {
    super(cd);
    this.baseValue = '';
    this.wrapEvent = false;
  }

  @ViewChild(CdkOverlayOrigin, { static: true }) overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;

  public panel: Panel;
  public panelOpen = false;
  public panelPosition = PanelDefaultPosVer.belowLeftRight;
  public panelClassList: string[] = ['b-select-panel'];
  public positionClassList: OverlayPositionClasses = {};
  public readonly defaultValue = COLOR_PICKER_DEFAULT;
  public readonly colorPickerWidth = '278'; // scss $b-select-panel-min-width - 2px

  public get overlayRef(): OverlayRef {
    return this.panel?.overlayRef;
  }

  public openPanel(): void {
    this.panel = this.listPanelService.openPanel({ self: this });
  }

  public closePanel(): void {
    this.destroyPanel();
  }

  public onInputChange(event: DOMInputEvent): void {
    const value = event.target.value;

    // tslint:disable-next-line: triple-equals
    if (value != this.value) {
      this.writeValue(value, this.forceElementValue);
      this.transmitValue(this.value, {
        eventType: [InputEventType.onChange]
      });
    }
  }

  public onColorPickerChange(color) {
    this.value = color;
    this.transmitValue(this.value, { eventType: [InputEventType.onBlur] });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroyPanel(true);
  }

  private destroyPanel(skipEmit = false): void {
    this.panel = this.listPanelService.destroyPanel({ self: this, skipEmit });
  }
}

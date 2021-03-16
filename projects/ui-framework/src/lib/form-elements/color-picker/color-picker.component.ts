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
import {
  BaseFormElement,
  DOMInputEvent,
  InputEventType,
  OverlayPositionClasses,
  Panel,
  PanelDefaultPosVer,
} from 'bob-style';
import {
  ListPanelService,
  OverlayEnabledComponent,
} from '../../lists/list-panel.service';
import { CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';

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
  implements OnDestroy, OverlayEnabledComponent {
  constructor(
    public cd: ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef,
    private listPanelService: ListPanelService
  ) {
    super(cd);
    this.baseValue = '';
    this.wrapEvent = false;
  }

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;

  public panel: Panel;
  public panelOpen = false;
  public panelPosition = PanelDefaultPosVer.belowLeftRight;
  public panelClassList: string[] = ['b-select-panel'];
  public positionClassList: OverlayPositionClasses = {};

  public get overlayRef(): OverlayRef {
    return this.panel?.overlayRef;
  }

  public openPanel(): void {
    this.panel = this.listPanelService.openPanel({ self: this });
  }

  public closePanel(): void {
    this.destroyPanel();
  }

  public onInputChange(event: DOMInputEvent): void {}

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

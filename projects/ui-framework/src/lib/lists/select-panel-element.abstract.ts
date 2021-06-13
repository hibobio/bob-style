import {
  CdkOverlayOrigin,
  ConnectedPosition,
  OverlayRef,
} from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AvatarSize } from '../avatar/avatar/avatar.enum';
import { BaseFormElement } from '../form-elements/base-form-element';
import {
  FormElementSize,
  FormEvents,
} from '../form-elements/form-elements.enum';
import { Icons } from '../icons/icons.enum';
import { PanelDefaultPosVer } from '../popups/panel/panel.enum';
import { Panel } from '../popups/panel/panel.interface';
import { TooltipClass } from '../popups/tooltip/tooltip.enum';
import { TruncateTooltipType } from '../popups/truncate-tooltip/truncate-tooltip.enum';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import {
  applyChanges,
  hasChanges,
  isDefined,
  isNotEmptyArray,
  notFirstChanges,
} from '../services/utils/functional-utils';
import { MobileService } from '../services/utils/mobile.service';
import { selectValueOrFail } from '../services/utils/transformers';
import { OverlayPositionClasses } from '../types';
import { ListChange } from './list-change/list-change';
import { ListChangeService } from './list-change/list-change.service';
import {
  ListPanelService,
  OverlayEnabledComponent,
} from './list-panel.service';
import { ListModelService } from './list-service/list-model.service';
import { SELECT_PANEL_PROPS_DEF } from './list.consts';
import { BackdropClickMode, SelectMode, SelectType } from './list.enum';
import { itemID, ListFooterActions, SelectGroupOption } from './list.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseSelectPanelElement
  extends BaseFormElement
  implements
    OverlayEnabledComponent,
    OnChanges,
    OnInit,
    AfterViewInit,
    OnDestroy {
  protected constructor(
    protected listChangeSrvc: ListChangeService,
    protected modelSrvc: ListModelService,
    protected listPanelSrvc: ListPanelService,
    protected mobileService: MobileService,
    protected translate: TranslateService,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    public cd: ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef
  ) {
    super(cd);
    this.placeholder = this.translate.instant('common.select');
  }

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;
  @ViewChild('prefix') prefix: ElementRef<HTMLElement>;

  @HostBinding('attr.data-size') @Input() size = SELECT_PANEL_PROPS_DEF.size;

  @Input() value: itemID[];
  @Input() options: SelectGroupOption[] = [];
  @Input() optionsDefault: SelectGroupOption[];
  @Input() mode: SelectMode = SELECT_PANEL_PROPS_DEF.mode;

  @Input() isQuickFilter = false;
  @Input() hasPrefix = false;

  @Input() panelPosition: PanelDefaultPosVer | ConnectedPosition[];
  @Input() panelClass: string;
  @Input() hasArrow = SELECT_PANEL_PROPS_DEF.hasArrow;
  @Input() hasBackdrop: boolean;

  @Input() showSingleGroupHeader = false;
  @Input() startWithGroupsCollapsed =
    SELECT_PANEL_PROPS_DEF.startWithGroupsCollapsed;
  @Input() tooltipType: TruncateTooltipType =
    SELECT_PANEL_PROPS_DEF.tooltipType;
  @Input() listActions: ListFooterActions;

  @Input() min: number;
  @Input() max: number;

  @Input() defaultIcon: Icons;
  @Input() backdropClickMode: BackdropClickMode =
    SELECT_PANEL_PROPS_DEF.backdropClickMode;
  @Input() showValueShowcase = SELECT_PANEL_PROPS_DEF.showValueShowcase;

  @Output()
  selectChange: EventEmitter<ListChange> = new EventEmitter();
  @Output() opened: EventEmitter<OverlayRef> = new EventEmitter();
  @Output() closed: EventEmitter<void> = new EventEmitter();

  protected type: SelectType;
  public showPrefix = true;
  public displayValue: string;
  public displayValueCount: number;
  protected listChange: ListChange;

  private fitOptionsToValue = false;
  readonly formElementSize = FormElementSize;
  readonly avatarSize = AvatarSize;

  public touched = false;
  public dirty = false;
  public isMobile = false;

  public panel: Panel;
  public panelOpen = false;
  public panelClassList: string[] = ['b-select-panel'];
  public positionClassList: OverlayPositionClasses = {};

  public get overlayRef(): OverlayRef {
    return this.panel?.overlayRef;
  }

  readonly tooltipClass: (TooltipClass | string)[] = [
    TooltipClass.TextLeft,
    TooltipClass.PreWrap,
  ];

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        ...SELECT_PANEL_PROPS_DEF,
        placeholder: this.translate.instant('common.select'),
      },
      ['value'],
      true,
      {
        truthyCheck: isDefined,
      }
    );

    if (
      hasChanges(changes, ['disabled', 'errorMessage', 'warnMessage', 'mode'])
    ) {
      this.destroyPanel();
    }

    if (hasChanges(changes, ['options'], true)) {
      this.options = this.modelSrvc.enrichIncomingOptions(this.options);
    }

    if (hasChanges(changes, ['options'], true) && !this.fitOptionsToValue) {
      this.value = this.modelSrvc.getSelectedIDs(this.options);
    }

    if (hasChanges(changes, ['options'], true) && this.fitOptionsToValue) {
      this.writeValue(this.value, this.options);
    }

    if (hasChanges(changes, ['value'])) {
      this.writeValue(changes.value.currentValue, this.options);
    }

    this.onNgChanges(changes);

    if (
      (hasChanges(changes, ['options'], true) && !this.fitOptionsToValue) ||
      ((changes.size || changes.defaultIcon) &&
        !changes.value &&
        !changes.options)
    ) {
      this.setDisplayValue();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.showPrefix =
          this.prefix && !this.DOM.isEmpty(this.prefix.nativeElement);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }

  ngOnInit(): void {
    if (this.isQuickFilter) {
      this.panelClassList.push('b-quick-filter-panel');
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroyPanel(true);
  }

  writeValue(value: any, options: SelectGroupOption[] = this.options): void {
    if (value === undefined) {
      return;
    }

    this.value = selectValueOrFail(value);
    this.fitOptionsToValue = true;

    if (isNotEmptyArray(options)) {
      this.options = this.listChangeSrvc.getCurrentSelectGroupOptions({
        options,
        selectedIDs: this.value,
      });
    }

    this.setDisplayValue();
  }

  focus(): void {
    this.openPanel();
  }

  togglePanel(): void {
    !this.panel ? this.openPanel() : this.closePanel();
  }

  openPanel(): void {
    this.panel = this.listPanelSrvc.openPanel({
      self: this,
      hasBackdrop: this.hasBackdrop,
    });
  }

  closePanel(): void {
    this.destroyPanel();
  }

  onApply(): void {
    this.destroyPanel();
  }

  onCancel(): void {
    this.destroyPanel();
  }

  onSelect(listChange: ListChange): void {
    this.listChange = listChange;
    this.value = listChange.getSelectedIds();
    this.setDisplayValue();
    this.emitChange(
      this.type === SelectType.multi
        ? FormEvents.selectModified
        : FormEvents.selectChange,
      listChange
    );
  }

  protected destroyPanel(skipEmit = false): void {
    if (this.panel) {
      this.touched = true;
    }
    this.panel = this.listPanelSrvc.destroyPanel({ self: this, skipEmit });
  }

  protected setDisplayValue(): void {
    this.displayValue = this.getDisplayValue() || null;
    this.displayValueCount = this.value ? this.value.length : 0;
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  protected getDisplayValue(): string {
    return null;
  }

  protected emitChange(event: FormEvents, listChange: ListChange): void {}
}

import {
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  AfterViewInit,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  Directive,
  OnInit,
  HostBinding,
} from '@angular/core';
import {
  CdkOverlayOrigin,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { PanelPositionService } from '../popups/panel/panel-position-service/panel-position.service';
import { BaseFormElement } from '../form-elements/base-form-element';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import { TruncateTooltipType } from '../popups/truncate-tooltip/truncate-tooltip.enum';
import { OverlayPositionClasses } from '../types';
import { UtilsService } from '../services/utils/utils.service';
import {
  hasChanges,
  applyChanges,
  notFirstChanges,
  isNotEmptyArray,
} from '../services/utils/functional-utils';
import { SelectGroupOption, ListFooterActions } from './list.interface';
import { ListChange } from './list-change/list-change';
import { PanelDefaultPosVer } from '../popups/panel/panel.enum';
import { LIST_EL_HEIGHT } from './list.consts';
import { ListChangeService } from './list-change/list-change.service';
import { selectValueOrFail } from '../services/utils/transformers';
import { ListModelService } from './list-service/list-model.service';
import { SelectType, SelectMode } from './list.enum';
import {
  FormEvents,
  FormElementSize,
} from '../form-elements/form-elements.enum';
import { ListPanelService } from './list-panel.service';
import { MobileService } from '../services/utils/mobile.service';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseSelectPanelElement extends BaseFormElement
  implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  protected constructor(
    protected listChangeSrvc: ListChangeService,
    protected modelSrvc: ListModelService,
    protected listPanelSrvc: ListPanelService,
    protected mobileService: MobileService,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    // Used by ListPanelService:
    protected overlay: Overlay,
    protected viewContainerRef: ViewContainerRef,
    protected panelPositionService: PanelPositionService,
    protected utilsService: UtilsService
  ) {
    super(cd);
  }

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;
  @ViewChild('prefix') prefix: ElementRef;

  @HostBinding('attr.data-size') @Input() size = FormElementSize.regular;

  @Input() value: (number | string)[];
  @Input() options: SelectGroupOption[] = [];
  @Input() optionsDefault: SelectGroupOption[];
  @Input() mode: SelectMode = SelectMode.classic;

  @Input() isQuickFilter = false;
  @Input() hasPrefix = false;

  @Input() panelPosition: PanelDefaultPosVer | ConnectedPosition[];
  @Input() panelClass: string;
  @Input() hasArrow = true;

  @Input() showSingleGroupHeader = false;
  @Input() startWithGroupsCollapsed = true;
  @Input() tooltipType: TruncateTooltipType = TruncateTooltipType.auto;
  @Input() listActions: ListFooterActions;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();
  @Output() opened: EventEmitter<OverlayRef> = new EventEmitter<OverlayRef>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  protected type: SelectType;
  public showPrefix = true;
  public focusOnInit = true;
  public displayValue: string;
  public displayValueCount: number;
  protected listChange: ListChange;

  private fitOptionsToValue = false;
  readonly listElHeight = LIST_EL_HEIGHT;

  public touched = false;
  public dirty = false;
  public isMobile = false;

  // Used by ListPanelService:
  private subscribtions: Subscription[] = [];
  public panelClassList: string[] = ['b-select-panel'];
  public positionClassList: OverlayPositionClasses = {};
  public overlayRef: OverlayRef;
  private panelConfig: OverlayConfig;
  private templatePortal: TemplatePortal;
  public panelOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        options: [],
        mode: SelectMode.classic,
      },
      ['value']
    );

    if (
      hasChanges(changes, ['disabled', 'errorMessage', 'warnMessage', 'mode'])
    ) {
      this.destroyPanel();
    }

    if (hasChanges(changes, ['options'])) {
      this.options = this.options.filter((group: SelectGroupOption) =>
        isNotEmptyArray(group.options)
      );
    }

    if (hasChanges(changes, ['options']) && !this.fitOptionsToValue) {
      this.value = this.modelSrvc.getSelectedIDs(this.options);
    }

    if (hasChanges(changes, ['options']) && this.fitOptionsToValue) {
      this.writeValue(this.value, this.options);
    }

    if (hasChanges(changes, ['value'])) {
      this.writeValue(changes.value.currentValue, this.options);
    }

    this.onNgChanges(changes);

    if (hasChanges(changes, ['options']) && !this.fitOptionsToValue) {
      this.setDisplayValue();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngAfterViewInit(): void {
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
    this.destroyPanel(true);
  }

  writeValue(value: any, options: SelectGroupOption[] = this.options): void {
    if (value === undefined) {
      return;
    }

    this.value = selectValueOrFail(value);
    this.fitOptionsToValue = true;

    if (isNotEmptyArray(options)) {
      this.options = this.listChangeSrvc.getCurrentSelectGroupOptions(
        options,
        this.value
      );
    }

    this.setDisplayValue();
  }

  openPanel(): void {
    this.listPanelSrvc.openPanel(this);
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
    if (this.overlayRef) {
      this.touched = true;
    }

    this.listPanelSrvc.destroyPanel(this, skipEmit);

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
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

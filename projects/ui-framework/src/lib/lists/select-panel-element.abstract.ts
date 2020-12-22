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
  OverlayRef,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { BaseFormElement } from '../form-elements/base-form-element';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import { TruncateTooltipType } from '../popups/truncate-tooltip/truncate-tooltip.enum';
import { OverlayPositionClasses } from '../types';
import {
  hasChanges,
  applyChanges,
  notFirstChanges,
  isNotEmptyArray,
} from '../services/utils/functional-utils';
import { SelectGroupOption, ListFooterActions, itemID } from './list.interface';
import { ListChange } from './list-change/list-change';
import { PanelDefaultPosVer } from '../popups/panel/panel.enum';
import { ListChangeService } from './list-change/list-change.service';
import { selectValueOrFail } from '../services/utils/transformers';
import { ListModelService } from './list-service/list-model.service';
import { SelectType, SelectMode, BackdropClickMode } from './list.enum';
import {
  FormEvents,
  FormElementSize,
} from '../form-elements/form-elements.enum';
import {
  ListPanelService,
  OverlayEnabledComponent,
} from './list-panel.service';
import { MobileService } from '../services/utils/mobile.service';
import { TooltipClass } from '../popups/tooltip/tooltip.enum';
import { TranslateService } from '@ngx-translate/core';
import { AvatarSize } from '../avatar/avatar/avatar.enum';
import { Icons } from '../icons/icons.enum';
import { Panel } from '../popups/panel/panel.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseSelectPanelElement extends BaseFormElement
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
  @ViewChild('prefix') prefix: ElementRef;

  @HostBinding('attr.data-size') @Input() size = FormElementSize.regular;

  @Input() value: itemID[];
  @Input() options: SelectGroupOption[] = [];
  @Input() optionsDefault: SelectGroupOption[];
  @Input() mode: SelectMode = SelectMode.classic;

  @Input() isQuickFilter = false;
  @Input() hasPrefix = false;

  @Input() panelPosition: PanelDefaultPosVer | ConnectedPosition[];
  @Input() panelClass: string;
  @Input() hasArrow = true;
  @Input() hasBackdrop: boolean;

  @Input() showSingleGroupHeader = false;
  @Input() startWithGroupsCollapsed = true;
  @Input() tooltipType: TruncateTooltipType = TruncateTooltipType.auto;
  @Input() listActions: ListFooterActions;

  @Input() min: number;
  @Input() max: number;

  @Input() defaultIcon: Icons;
  @Input() backdropClickMode: BackdropClickMode = BackdropClickMode.apply;
  @Input() showValueShowcase = true;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();
  @Output() opened: EventEmitter<OverlayRef> = new EventEmitter<OverlayRef>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

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
  public subscribtions: Subscription[] = [];

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
        options: [],
        mode: SelectMode.classic,
        placeholder: this.translate.instant('common.select'),
      },
      ['value'],
      true
    );

    if (
      hasChanges(changes, ['disabled', 'errorMessage', 'warnMessage', 'mode'])
    ) {
      this.destroyPanel();
    }

    if (hasChanges(changes, ['options'], true)) {
      this.options = this.options.filter((group: SelectGroupOption) =>
        isNotEmptyArray(group.options)
      );
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

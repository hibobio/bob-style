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
} from '@angular/core';
import {
  CdkOverlayOrigin,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ConnectedPosition,
  ConnectedOverlayPositionChange,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription, race } from 'rxjs';
import { PanelPositionService } from '../popups/panel/panel-position-service/panel-position.service';
import { BaseFormElement } from '../form-elements/base-form-element';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import { TruncateTooltipType } from '../popups/truncate-tooltip/truncate-tooltip.enum';
import isEqual from 'lodash/isEqual';
import {
  distinctUntilChanged,
  filter,
  throttleTime,
  pairwise,
  map,
} from 'rxjs/operators';
import { OverlayPositionClasses } from '../types';
import { UtilsService } from '../services/utils/utils.service';
import { outsideZone } from '../services/utils/rxjs.operators';
import {
  isKey,
  hasChanges,
  applyChanges,
  notFirstChanges,
  isNotEmptyArray,
} from '../services/utils/functional-utils';
import { Keys } from '../enums';
import { SelectGroupOption, ListFooterActions } from './list.interface';
import { ListChange } from './list-change/list-change';
import { PanelDefaultPosVer } from '../popups/panel/panel.enum';
import { LIST_EL_HEIGHT } from './list.consts';
import { ListChangeService } from './list-change/list-change.service';
import { selectValueOrFail } from '../services/utils/transformers';
import { ListModelService } from './list-service/list-model.service';
import { ScrollEvent } from '../services/utils/utils.interface';
import { SelectType } from './list.enum';
import { FormEvents } from '../form-elements/form-elements.enum';

export abstract class BaseSelectPanelElement extends BaseFormElement
  implements OnChanges, AfterViewInit, OnDestroy {
  protected constructor(
    protected listChangeSrvc: ListChangeService,
    protected modelSrvc: ListModelService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
    protected utilsService: UtilsService,
    public DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef
  ) {
    super(cd);
  }

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;
  @ViewChild('prefix', { static: false }) prefix: ElementRef;

  @Input() value: (number | string)[];
  @Input() options: SelectGroupOption[] = [];
  @Input() optionsDefault: SelectGroupOption[];
  @Input() panelClass: string;
  @Input() isQuickFilter = false;
  @Input() hasPrefix = false;
  @Input() panelPosition: PanelDefaultPosVer | ConnectedPosition[];
  @Input('hasArrow') set setPanelArrowClass(hasArrow: boolean) {
    if (hasArrow === false) {
      this.panelClassList =
        hasArrow === false
          ? (this.panelClassList = this.panelClassList.filter(
              c => c !== 'b-select-panel-with-arrow'
            ))
          : hasArrow === true
          ? [...(this.panelClassList || []), 'b-select-panel-with-arrow']
          : this.panelClassList || [];
    }
  }
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
  public displayValue: string;
  public displayValueCount: number;
  protected listChange: ListChange;
  private subscribtions: Subscription[] = [];
  private fitOptionsToValue = false;
  readonly listElHeight = LIST_EL_HEIGHT;

  public panelClassList: string[] = [];
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
      },
      ['value']
    );

    if (hasChanges(changes, ['disabled', 'errorMessage', 'warnMessage'])) {
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

  ngOnDestroy(): void {
    this.destroyPanel();
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
    if (!this.overlayRef && !this.disabled && !this.panelOpen) {
      this.panelOpen = true;
      this.panelConfig = this.getConfig();
      this.overlayRef = this.overlay.create(this.panelConfig);
      this.templatePortal = new TemplatePortal(
        this.templateRef,
        this.viewContainerRef
      );

      this.overlayRef.attach(this.templatePortal);
      this.overlayRef.updatePosition();
      this.overlayRef.updateSize({
        width: this.overlayOrigin.elementRef.nativeElement.offsetWidth,
        height: 360,
      });

      const searchInput = this.overlayRef.overlayElement.querySelector(
        'b-search .bfe-input'
      ) as HTMLElement;
      if (searchInput) {
        searchInput.focus();
      }

      if (this.opened.observers.length > 0) {
        this.opened.emit(this.overlayRef);
      }

      this.subscribtions.push(
        (this.panelConfig
          .positionStrategy as FlexibleConnectedPositionStrategy).positionChanges
          .pipe(
            throttleTime(200, undefined, {
              leading: true,
              trailing: true,
            }),
            distinctUntilChanged(isEqual)
          )
          .subscribe((change: ConnectedOverlayPositionChange) => {
            this.positionClassList = this.panelPositionService.getPositionClassList(
              change
            );

            if (!this.cd['destroyed']) {
              this.cd.detectChanges();
            }
          })
      );

      this.subscribtions.push(
        race(
          this.overlayRef.backdropClick(),
          this.utilsService.getWindowKeydownEvent().pipe(
            outsideZone(this.zone),
            filter((event: KeyboardEvent) => isKey(event.key, Keys.escape))
          ),
          this.utilsService.getResizeEvent().pipe(outsideZone(this.zone)),
          this.utilsService.getScrollEvent().pipe(
            outsideZone(this.zone),
            throttleTime(50, undefined, {
              leading: true,
              trailing: true,
            }),
            map((e: ScrollEvent) => e.scrollY),
            pairwise(),
            filter(
              (scrollArr: number[]) =>
                Math.abs(scrollArr[0] - scrollArr[1]) > 20
            )
          )
        ).subscribe(() => {
          this.zone.run(() => {
            this.onApply();
          });
        })
      );
    }
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

  protected destroyPanel(): void {
    this.panelOpen = false;
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.panelConfig = {};
      this.templatePortal = null;
      this.overlayRef = null;

      this.subscribtions.forEach(sub => {
        sub.unsubscribe();
        sub = null;
      });
      this.subscribtions = [];

      if (this.closed.observers.length > 0) {
        this.closed.emit();
      }
    }
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  private getPanelClass(): string[] {
    return [
      ...this.panelClassList,
      'b-select-panel',
      this.panelClass,
      this.isQuickFilter ? 'b-quick-filter-panel' : null,
    ].filter(Boolean);
  }

  private getConfig(): OverlayConfig {
    return {
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass: 'b-select-backdrop',
      panelClass: this.getPanelClass(),
      positionStrategy: this.panelPositionService.getPanelPositionStrategy(
        this.overlayOrigin,
        this.panelPosition
      ),
      scrollStrategy: this.panelPositionService.getScrollStrategy(),
    };
  }

  protected setDisplayValue(): void {
    this.displayValue = this.getDisplayValue() || null;
    this.displayValueCount = this.value ? this.value.length : 0;
    this.cd.detectChanges();
  }

  protected getDisplayValue(): string {
    return null;
  }

  protected emitChange(event: FormEvents, listChange: ListChange): void {}
}

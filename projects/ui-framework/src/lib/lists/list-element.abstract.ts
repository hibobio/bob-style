import {
  AfterViewInit,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  NgZone,
  SimpleChanges,
  OnChanges,
  Directive,
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import {
  ListHeader,
  ListOption,
  ListFooterActions,
  SelectGroupOption,
  ListFooterActionsState,
  UpdateListsConfig,
} from './list.interface';
import { cloneDeep, isEqual } from 'lodash';
import {
  LIST_EL_HEIGHT,
  DISPLAY_SEARCH_OPTION_NUM,
  UPDATE_LISTS_CONFIG_DEF,
  LIST_MAX_ITEMS,
} from './list.consts';
import { ListKeyboardService } from './list-service/list-keyboard.service';
import { Keys } from '../enums';
import { ListChange } from './list-change/list-change';
import { DOMhelpers } from '../services/html/dom-helpers.service';
import {
  objectHasTruthyValue,
  applyChanges,
  isNotEmptyArray,
  getEventPath,
  hasChanges,
  cloneDeepSimpleObject,
  simpleChange,
} from '../services/utils/functional-utils';
import { ListModelService } from './list-service/list-model.service';
import { ListChangeService } from './list-change/list-change.service';
import { LIST_ACTIONS_STATE_DEF } from './list-footer/list-footer.const';
import { SelectType, SelectMode } from './list.enum';
import { SearchComponent } from '../search/search/search.component';
import { MobileService } from '../services/utils/mobile.service';
import { IconColor, Icons, IconSize } from '../icons/icons.enum';
import { TooltipClass, TooltipPosition } from '../popups/tooltip/tooltip.enum';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseListElement
  implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  protected constructor(
    private renderer: Renderer2,
    private keybrdSrvc: ListKeyboardService,
    protected modelSrvc: ListModelService,
    protected listChangeSrvc: ListChangeService,
    protected mobileService: MobileService,
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected DOM: DOMhelpers,
    protected host: ElementRef
  ) {
    this.isMobile = this.mobileService.isMobile();
  }

  @ViewChild('vScroll', { static: true }) vScroll: CdkVirtualScrollViewport;
  @ViewChild('headers') headers;
  @ViewChild('footer', { read: ElementRef })
  private footer: ElementRef;
  @ViewChild('search', { read: SearchComponent })
  protected search: SearchComponent;

  @Input() options: SelectGroupOption[] = [];
  @Input() optionsDefault: SelectGroupOption[];
  @Input() mode: SelectMode = SelectMode.classic;
  @Input() listActions: ListFooterActions;
  @Input() maxHeight = LIST_EL_HEIGHT * LIST_MAX_ITEMS;
  @Input() showSingleGroupHeader = false;
  @Input() startWithGroupsCollapsed = true;
  @Input() showNoneOption = false;
  @Input() readonly = false;
  @Input() focusOnInit = false;

  @Input() min: number;
  @Input() max: number;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  @Output() apply: EventEmitter<ListChange> = new EventEmitter<ListChange>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  protected type: SelectType;
  public noGroupHeaders: boolean;
  public focusOption: ListOption;
  public listOptions: ListOption[];
  public listHeaders: ListHeader[];
  public focusIndex: number;
  public maxHeightItems = LIST_MAX_ITEMS;
  public listHeight = null;
  public listMinHeight = 0;
  public searchValue: string;
  public shouldDisplaySearch = false;
  public filteredOptions: SelectGroupOption[];
  public listActionsState: ListFooterActionsState = cloneDeepSimpleObject(
    LIST_ACTIONS_STATE_DEF
  );
  public hasFooter = true;
  public allGroupsCollapsed: boolean;
  public isMobile = false;

  public selectedIDs: (string | number)[];
  protected optionsDefaultIDs: (string | number)[];
  protected listChange: ListChange;

  private keyDownSubscriber: Subscription;
  readonly listElHeight = LIST_EL_HEIGHT;
  readonly modes = SelectMode;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly infoIcon = Icons.info_outline.replace('b-icon-', '');
  readonly tooltipPosition = TooltipPosition.above;
  readonly tooltipClass: (TooltipClass | string)[] = [
    TooltipClass.TextLeft,
    TooltipClass.PreWrap,
    'b-select-option-tooltip',
  ];
  readonly tooltipDelay = 300;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes, {
      options: [],
      mode: SelectMode.classic,
      startWithGroupsCollapsed: true,
      maxHeight: LIST_EL_HEIGHT * LIST_MAX_ITEMS,
    });

    if (this.mode === SelectMode.tree) {
      this.mode = SelectMode.classic;
    }

    if (hasChanges(changes, ['options'])) {
      this.options = this.options.filter((group: SelectGroupOption) =>
        isNotEmptyArray(group.options)
      );
    }

    if (hasChanges(changes, ['startWithGroupsCollapsed', 'options'])) {
      this.startWithGroupsCollapsed =
        (this.startWithGroupsCollapsed || !changes.startWithGroupsCollapsed) &&
        isNotEmptyArray(this.options, 1);
    }

    if (hasChanges(changes, ['options', 'showSingleGroupHeader'])) {
      this.selectedIDs = this.getSelectedIDs(this.options);
      this.filteredOptions = cloneDeep(this.options) || [];

      this.shouldDisplaySearch =
        this.options &&
        this.modelSrvc.totalOptionsCount(this.options) >
          DISPLAY_SEARCH_OPTION_NUM;

      this.noGroupHeaders =
        !this.options ||
        (this.options.length < 2 && !this.showSingleGroupHeader);
    }

    if (
      hasChanges(changes, [
        'options',
        'showSingleGroupHeader',
        'mode',
        'min',
        'max',
      ])
    ) {
      this.allGroupsCollapsed =
        isNotEmptyArray(this.options, 1) &&
        ((!changes.options && this.allGroupsCollapsed) ||
          (changes.options && this.startWithGroupsCollapsed));

      this.updateLists({ collapseHeaders: this.allGroupsCollapsed });
    } else if (hasChanges(changes, ['startWithGroupsCollapsed'])) {
      this.toggleCollapseAll(this.startWithGroupsCollapsed);
    }

    if (hasChanges(changes, ['optionsDefault'])) {
      const defaultsExist = isNotEmptyArray(this.optionsDefault);

      this.optionsDefaultIDs = defaultsExist
        ? this.getSelectedIDs(this.optionsDefault)
        : undefined;

      this.listActions.clear = !defaultsExist && !this.showNoneOption;
      this.listActions.reset = defaultsExist;
    }

    if (
      hasChanges(changes, [
        'options',
        'showSingleGroupHeader',
        'optionsDefault',
      ])
    ) {
      this.updateActionButtonsState();
    }

    if (hasChanges(changes, ['maxHeight', 'options'], true)) {
      this.maxHeightItems =
        Math.round((this.maxHeight || 0) / LIST_EL_HEIGHT) || LIST_MAX_ITEMS;

      this.maxHeight = this.maxHeightItems * LIST_EL_HEIGHT;

      this.DOM.setCssProps(this.host.nativeElement, {
        '--list-max-items': this.maxHeight / LIST_EL_HEIGHT || null,
      });
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.focusIndex = -1;
    this.keyDownSubscriber = this.keybrdSrvc
      .getKeyboardNavigationObservable()
      .subscribe((e: KeyboardEvent) => {
        if (!getEventPath(e).includes(this.host.nativeElement)) {
          return;
        }

        switch (e.key) {
          case Keys.arrowdown:
            e.preventDefault();
            this.focusIndex = this.keybrdSrvc.getNextFocusIndex(
              Keys.arrowdown,
              this.focusIndex,
              this.listOptions.length
            );
            this.focusOption = this.listOptions[this.focusIndex];
            this.vScroll.scrollToIndex(
              this.keybrdSrvc.getScrollToIndex(this.focusIndex, this.maxHeight)
            );
            if (!this.cd['destroyed']) {
              this.cd.detectChanges();
            }
            break;
          case Keys.arrowup:
            e.preventDefault();
            this.focusIndex = this.keybrdSrvc.getNextFocusIndex(
              Keys.arrowup,
              this.focusIndex,
              this.listOptions.length
            );
            this.focusOption = this.listOptions[this.focusIndex];
            this.vScroll.scrollToIndex(
              this.keybrdSrvc.getScrollToIndex(this.focusIndex, this.maxHeight)
            );
            if (!this.cd['destroyed']) {
              this.cd.detectChanges();
            }
            break;
          case Keys.enter:
            e.preventDefault();
            if (!this.focusOption) {
              break;
            }
            if (this.focusOption.isPlaceHolder) {
              const headerIndex = this.listHeaders.findIndex(
                (header) => header.groupName === this.focusOption.groupName
              );
              if (headerIndex > -1) {
                this.headerClick(this.listHeaders[headerIndex], headerIndex);
              }
            } else {
              this.optionClick(this.focusOption);
            }

            break;
          default:
            break;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.keyDownSubscriber) {
      this.keyDownSubscriber.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (!this.noGroupHeaders) {
      this.renderer.insertBefore(
        this.vScroll.elementRef.nativeElement,
        this.headers.nativeElement,
        this.vScroll.elementRef.nativeElement.firstChild
      );
    }

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasFooter =
          (!this.readonly && objectHasTruthyValue(this.listActions)) ||
          !this.DOM.isEmpty(this.footer.nativeElement);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }

        if (this.focusOnInit && this.search && !this.isMobile) {
          this.search.input.nativeElement.focus();
        }
      }, 0);
    });
  }

  searchChange(searchValue: string): void {
    this.searchValue = searchValue.trim();

    this.filteredOptions = this.modelSrvc.getFilteredOptions(
      this.options,
      this.searchValue
    );

    this.updateLists({
      collapseHeaders: this.startWithGroupsCollapsed && !this.searchValue,
      updateListMinHeight: false,
    });
  }

  optionClick(
    option: ListOption,
    allowMultiple = this.type === SelectType.multi
  ): void {
    if (!option.disabled && !this.readonly) {
      let newValue: boolean;

      if (option.exclusive && !option.selected && allowMultiple) {
        option.selected = true;
        this.clearList([option.id]);
        return;
      }

      if (!this.mode || this.mode === SelectMode.classic || !allowMultiple) {
        newValue = !option.selected;

        if (newValue !== option.selected) {
          this.selectedIDs = allowMultiple
            ? newValue
              ? this.selectedIDs.concat(option.id)
              : this.selectedIDs.filter((id) => id !== option.id)
            : [option.id];
        }
      }

      if (this.mode && this.mode !== SelectMode.classic && allowMultiple) {
        newValue =
          this.mode === SelectMode.radioGroups ? true : !option.selected;

        if (newValue !== option.selected) {
          const groupIDsInSelected = this.options[option.groupIndex].options
            .map((optn) => optn.id)
            .filter((id) => this.selectedIDs.includes(id));

          this.selectedIDs = this.selectedIDs
            .filter((id) => !groupIDsInSelected.includes(id))
            .concat(
              newValue || this.mode === SelectMode.radioGroups ? option.id : []
            );
        }
      }

      if (newValue !== option.selected) {
        option.selected = newValue;

        this.emitChange();

        this.updateLists({
          updateListHeaders: false,
          updateListOptions: false,
          selectedIDs: this.selectedIDs,
        });

        this.updateActionButtonsState();

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }
    }
  }

  headerClick(header: ListHeader, index: number): void {
    if (header.groupIsOption && !this.readonly) {
      this.optionClick({
        ...this.options[index].options[0],
        isPlaceHolder: false,
        groupName: header.groupName,
        groupIndex: index,
      } as ListOption);
    }
  }

  toggleGroupCollapse(header: ListHeader): void {
    header.isCollapsed = !header.isCollapsed;

    this.updateLists({
      updateListHeaders: false,
      selectedIDs: this.selectedIDs,
    });

    this.allGroupsCollapsed =
      this.listOptions.length === this.listHeaders.length;
  }

  toggleCollapseAll(force = null): void {
    if (this.options && this.options.length > 1) {
      this.allGroupsCollapsed =
        force !== null ? force : !this.allGroupsCollapsed;

      this.updateLists({
        collapseHeaders: this.allGroupsCollapsed,
      });
    }
  }

  clearList(setSelectedIDs: (string | number)[] = null): void {
    this.selectedIDs = this.getSelectedIDs(this.options, 'disabled').concat(
      setSelectedIDs || []
    );

    this.emitChange();

    this.modelSrvc.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.options
    );

    this.updateActionButtonsState(true);

    this.cd.detectChanges();
  }

  resetList(): void {
    this.ngOnChanges(
      simpleChange({
        options: cloneDeep(this.optionsDefault),
      })
    );

    this.emitChange();
    this.listActionsState.apply.disabled = false;

    this.cd.detectChanges();
  }

  onApply(): void {
    this.apply.emit(this.listChange);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  protected updateLists(config: UpdateListsConfig = {}): void {
    config = {
      ...UPDATE_LISTS_CONFIG_DEF,
      ...config,
    };

    if (config.updateListHeaders) {
      const isClassic =
        (!this.mode || this.mode === SelectMode.classic) &&
        !this.max &&
        !this.min;

      this.listHeaders = this.modelSrvc.getHeadersModel(
        this.filteredOptions,
        config.collapseHeaders,
        this.type === SelectType.multi && isClassic,
        isClassic &&
          !this.noGroupHeaders &&
          (this.options.length > 1 || this.showSingleGroupHeader)
      );
    }

    if (config.updateListOptions) {
      this.listOptions = this.modelSrvc.getOptionsModel(
        this.filteredOptions,
        this.listHeaders,
        this.noGroupHeaders
      );
      this.listHeight = this.getListHeight();
    }

    if (config.updateListMinHeight) {
      this.listMinHeight = this.getListMinHeight();
    }

    this.modelSrvc.setSelectedOptions(
      this.listHeaders,
      this.listOptions,
      this.options,
      config.selectedIDs
    );
  }

  protected getSelectedIDs(
    options: SelectGroupOption[] = this.options,
    mustBe = 'selected'
  ): (string | number)[] {
    return this.modelSrvc.getSelectedIDs(options, mustBe);
  }

  protected emitChange(): void {
    this.listChange = this.listChangeSrvc.getListChange(
      this.options,
      this.selectedIDs
    );

    this.options = this.listChange.getSelectGroupOptions();
    this.selectChange.emit(this.listChange);
    this.listActionsState.apply.disabled = false;
  }

  protected updateActionButtonsState(
    forceClear: boolean = null,
    forceReset: boolean = null
  ) {
    this.listActionsState.clear.hidden =
      forceClear !== null
        ? forceClear
        : !this.selectedIDs || this.selectedIDs.length === 0;

    this.listActionsState.reset.hidden =
      forceReset !== null
        ? forceReset
        : !this.selectedIDs ||
          !this.optionsDefaultIDs ||
          isEqual(this.selectedIDs.sort(), this.optionsDefaultIDs.sort());
  }

  public isSameGroup(
    group1: Partial<SelectGroupOption> | Partial<ListHeader>,
    group2: Partial<SelectGroupOption> | Partial<ListHeader>
  ): boolean {
    return this.modelSrvc.isSameGroup(group1, group2);
  }

  public headerTrackBy(index: number, listHeader: ListHeader): string {
    return index + listHeader.groupName;
  }

  protected getListMinHeight(): number {
    return this.listOptions?.length
      ? Math.min(this.getListHeight(), this.maxHeight)
      : null;
  }

  protected getListHeight(): number {
    return null;
  }
}

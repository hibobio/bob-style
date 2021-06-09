import { CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import {
  ListPanelService,
  OverlayEnabledComponent,
} from '../../lists/list-panel.service';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';
import { Panel } from '../../popups/panel/panel.interface';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { simpleUID } from '../../services/utils/functional-utils';
import {
  DOMFocusEvent,
  DOMKeyboardEvent,
  DOMMouseEvent,
  OverlayPositionClasses,
} from '../../types';
import { SearchComponent } from '../search/search.component';
import {
  MULTI_SEARCH_KEYMAP_DEF,
  MULTI_SEARCH_SHOW_ITEMS_DEF,
} from './multi-search.const';
import {
  MultiSearchClickedEvent,
  MultiSearchGroupOption,
  MultiSearchOption,
} from './multi-search.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class MultiSearchBaseElement
  implements OverlayEnabledComponent {
  constructor(
    public viewContainerRef: ViewContainerRef,
    public cd: ChangeDetectorRef,
    protected DOM: DOMhelpers,
    protected listPanelSrvc: ListPanelService
  ) {}

  @Input() label: string;
  @Input() placeholder: string;
  @Input() showItems: number;
  @Input() minSearchLength: number;

  @HostBinding('attr.data-size') @Input() size = FormElementSize.regular;

  @Output() opened: EventEmitter<OverlayRef> = new EventEmitter();
  @Output() closed: EventEmitter<void> = new EventEmitter();
  @Output()
  clicked: EventEmitter<MultiSearchClickedEvent> = new EventEmitter();

  public options: MultiSearchGroupOption[];
  public searchOptions: MultiSearchGroupOption[];
  public searchOptionsEmpty: MultiSearchGroupOption[];

  public id = simpleUID('bms');
  public searchValue: string;

  readonly keyMapDef = { ...MULTI_SEARCH_KEYMAP_DEF };
  readonly avatarSize = AvatarSize;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;
  readonly iconBgColor = '#f57738';
  readonly tooltipType = TruncateTooltipType;

  protected lastFocusedOption: HTMLElement;
  protected ignoreFocusOut = false;

  @ViewChild(SearchComponent, { static: true }) search: SearchComponent;

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;

  public panel: Panel;
  public panelOpen = false;
  public panelPosition = PanelDefaultPosVer.belowLeftRight;
  public panelClassList: string[] = ['b-select-panel', 'bms-select-panel'];
  public positionClassList: OverlayPositionClasses = {};

  public onFocusOut(event: Event | FocusEvent): void;
  public onFocusOut(event: DOMFocusEvent): void {
    if (this.ignoreFocusOut) {
      this.ignoreFocusOut = false;
      this.focusFirstOption(true);
      return;
    }

    const relatedTarget = event.relatedTarget;

    if (
      !relatedTarget ||
      (!this.panel?.overlayRef?.overlayElement.contains(relatedTarget) &&
        !relatedTarget.matches('.clear-input'))
    ) {
      this.closePanel();
      return;
    }

    if (relatedTarget.matches('.clear-input')) {
      this.focusSearchInput();
      return;
    }

    if (relatedTarget.matches('.bms-option:not(.bms-show-more)')) {
      this.lastFocusedOption = relatedTarget;
    }

    this.search.inputFocused = true;
  }

  public focusSearchInput(): void {
    this.search['skipFocusEvent'] = true;
    this.lastFocusedOption = undefined;
    this.search.input.nativeElement.focus();
  }

  protected focusFirstOption(focusList = false): HTMLElement {
    const elToFocus = (this.lastFocusedOption ||
      (!focusList &&
        this.panel?.overlayRef?.overlayElement?.querySelector(
          '.bms-option:not(.bms-show-more)'
        )) ||
      this.panel?.overlayRef?.overlayElement?.children[0]) as HTMLElement;

    elToFocus?.focus();

    return elToFocus;
  }

  public openPanel(): void {
    if (!this.panel) {
      this.panel = this.listPanelSrvc.openPanel({
        self: this,
        hasBackdrop: false,
      });
      this.focusSearchInput();
    }
  }

  public closePanel(): void {
    if (this.panel) {
      this.search.inputFocused = false;
      this.search['skipFocusEvent'] = false;
      this.lastFocusedOption = undefined;
      this.destroyPanel();
    } else {
      this.closed.emit();
    }
  }

  protected destroyPanel(skipEmit = false): void {
    this.panel = this.listPanelSrvc.destroyPanel({ self: this, skipEmit });

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  protected getGroupAndOptionFromUIEvent(
    event: DOMMouseEvent | DOMKeyboardEvent
  ): { group: MultiSearchGroupOption; option: MultiSearchOption } {
    const optionEl = this.DOM.getClosestUntil(
      event.target,
      '.bms-option',
      '.b-select-panel'
    );

    if (!optionEl) {
      return null;
    }

    const groupIndex = parseInt(optionEl.getAttribute('data-group-index'), 10);
    const optionIndex = parseInt(
      optionEl.getAttribute('data-option-index'),
      10
    );
    const group = this.searchOptions[groupIndex];
    const option =
      group[group.keyMap?.options || MULTI_SEARCH_KEYMAP_DEF.options][
        optionIndex
      ];

    return { group, option };
  }

  protected findSiblingOptionEl(
    optionEl: HTMLElement,
    which: 'next' | 'prev' = 'next'
  ): HTMLElement {
    return (
      this.DOM.getSibling(optionEl, '.bms-option', which) ||
      (() => {
        const siblingOptions = this.DOM.getSibling(
          optionEl.closest('.bms-group'),
          '.bms-group',
          which
        )?.querySelectorAll('.bms-option');

        return (
          siblingOptions &&
          (siblingOptions[
            which === 'prev' ? siblingOptions.length - 1 : 0
          ] as HTMLElement)
        );
      })()
    );
  }

  protected groupShowItemsMapper = (
    group: MultiSearchGroupOption
  ): MultiSearchGroupOption => ({
    ...group,
    showItems: this.getOptionsSliceLength(group),
    // tslint:disable-next-line: semicolon
  });

  public getOptionsSliceLength(
    group: MultiSearchGroupOption,
    options = null
  ): number {
    const optionsLength = (
      options || group[group.keyMap?.options || MULTI_SEARCH_KEYMAP_DEF.options]
    ).length;
    const currentSliceLength = group.showItems || 0;
    const step = this.showItems || MULTI_SEARCH_SHOW_ITEMS_DEF;

    return optionsLength - currentSliceLength - step > step
      ? currentSliceLength + step
      : optionsLength;
  }

  public groupTrackBy(index: number, group: MultiSearchGroupOption): string {
    return (
      group[group.keyMap?.key || MULTI_SEARCH_KEYMAP_DEF.key] ||
      group[group.keyMap?.groupName || MULTI_SEARCH_KEYMAP_DEF.groupName] ||
      index
    );
  }

  public optionTrackBy(groupIndex: number, group: MultiSearchGroupOption) {
    return (index: number, option: MultiSearchOption): string => {
      return `${this.groupTrackBy(groupIndex, group)}__${
        option[group.keyMap?.id || MULTI_SEARCH_KEYMAP_DEF.id] ||
        option[group.keyMap?.value || MULTI_SEARCH_KEYMAP_DEF.value] ||
        index
      }`;
    };
  }
}

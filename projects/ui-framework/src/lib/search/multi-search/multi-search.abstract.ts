import {
  Directive,
  ChangeDetectorRef,
  NgZone,
  ViewContainerRef,
  ViewChild,
  TemplateRef,
  Input,
} from '@angular/core';
import { ListPanelService } from '../../lists/list-panel.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import {
  Overlay,
  OverlayConfig,
  OverlayRef,
  CdkOverlayOrigin,
} from '@angular/cdk/overlay';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import {
  MULTI_SEARCH_KEYMAP_DEF,
  MULTI_SEARCH_SHOW_ITEMS_DEF,
} from './multi-search.const';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { Icons, IconColor, IconSize } from '../../icons/icons.enum';
import {
  MultiSearchGroupOption,
  MultiSearchOption,
} from './multi-search.interface';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';
import { Subscription } from 'rxjs';
import { OverlayPositionClasses } from '../../types';
import { TemplatePortal } from '@angular/cdk/portal';
import { simpleUID } from '../../services/utils/functional-utils';
import { SearchComponent } from '../search/search.component';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class MultiSearchBaseElement {
  constructor(
    protected cd: ChangeDetectorRef,
    protected listPanelSrvc: ListPanelService,
    // Used by ListPanelService:
    protected zone: NgZone,
    protected DOM: DOMhelpers,
    protected utilsService: UtilsService,
    protected overlay: Overlay,
    protected viewContainerRef: ViewContainerRef,
    protected panelPositionService: PanelPositionService
  ) {}

  @Input() label: string;
  @Input() placeholder: string;
  @Input() showItems: number;
  @Input() minSearchLength: number;

  public options: MultiSearchGroupOption[];
  public searchOptions: MultiSearchGroupOption[];
  public searchOptionsEmpty: MultiSearchGroupOption[];

  public id = simpleUID('bms-');
  public searchValue: string;

  readonly keyMapDef = { ...MULTI_SEARCH_KEYMAP_DEF };
  readonly avatarSize = AvatarSize;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;
  readonly iconBgColor = '#f57738';

  @ViewChild(SearchComponent, { static: true }) search: SearchComponent;

  // Used by ListPanelService:
  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;
  public panelPosition = PanelDefaultPosVer.belowLeftRight;
  protected subscribtions: Subscription[] = [];
  protected panelClassList: string[] = ['b-select-panel', 'bms-select-panel'];
  public positionClassList: OverlayPositionClasses = {};
  public overlayRef: OverlayRef;
  protected panelConfig: OverlayConfig;
  protected templatePortal: TemplatePortal;
  public panelOpen = false;

  public onFocusOut(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (
      !relatedTarget ||
      !this.overlayRef?.overlayElement.contains(relatedTarget)
    ) {
      this.closePanel();
      return;
    }

    if (relatedTarget !== this.overlayRef.overlayElement.children[0]) {
      this.search.inputFocused = true;
    }
  }

  protected focusSearchInput(): void {
    this.search['skipFocusEvent'] = true;
    this.search.input.nativeElement.focus();
  }

  public openPanel(): void {
    if (!this.overlayRef) {
      this.listPanelSrvc.openPanel(this, { hasBackdrop: false });
      this.focusSearchInput();
    }
  }

  public closePanel(): void {
    if (this.overlayRef) {
      this.search.inputFocused = false;
      this.search['skipFocusEvent'] = false;
      this.destroyPanel();
    }
  }

  protected destroyPanel(skipEmit = false): void {
    this.listPanelSrvc.destroyPanel(this, skipEmit);

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  protected getGroupAndOptionFromUIEvent(
    event: MouseEvent | KeyboardEvent
  ): { group: MultiSearchGroupOption; option: MultiSearchOption } {
    const optionEl = this.DOM.getClosestUntil(
      event.target as HTMLElement,
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

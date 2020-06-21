import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  NgZone,
} from '@angular/core';
import {
  MultiSearchGroupOption,
  MultiSearchOption,
  MultiSearchClickedEvent,
} from './multi-search.interface';
import {
  MULTI_SEARCH_KEYMAP_DEF,
  MULTI_SEARCH_SHOW_ITEMS_DEF,
  MULTI_SEARCH_MIN_SEARCH_LENGTH_DEF,
} from './multi-search.const';
import {
  isFunction,
  escapeRegExp,
  isKey,
} from '../../services/utils/functional-utils';
import { ListPanelService } from '../../lists/list-panel.service';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import { MultiSearchBaseElement } from './multi-search.abstract';
import { Keys, clickKeys, controlKeys } from '../../enums';

@Component({
  selector: 'b-multi-search',
  templateUrl: './multi-search.component.html',
  styleUrls: ['./multi-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSearchComponent extends MultiSearchBaseElement {
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
  ) {
    super(
      cd,
      listPanelSrvc,
      zone,
      DOM,
      utilsService,
      overlay,
      viewContainerRef,
      panelPositionService
    );
  }

  @Input('showAll')
  set setShowAll(showAll: boolean) {
    this.showAll = showAll;
    if (showAll && this.options) {
      this.searchOptions = this.options;
    }
  }
  private showAll = false;

  @Input('options') set setOptions(groupOptions: MultiSearchGroupOption[]) {
    this.options = groupOptions || [];
    this.searchOptionsEmpty = undefined;

    this.searchOptions = this.showAll
      ? this.options
      : this.filterOptions(this.searchValue, this.options);
  }

  @Output() clicked: EventEmitter<MultiSearchClickedEvent> = new EventEmitter<
    MultiSearchClickedEvent
  >();

  public onSearchChange(searchValue: string): void {
    searchValue = (searchValue || '').trim();

    const shouldOpenPanel = this.searchValue !== searchValue && searchValue;

    if (this.searchValue !== searchValue) {
      this.searchValue = searchValue;

      this.searchOptions = this.filterOptions(this.searchValue, this.options);

      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    }

    if (shouldOpenPanel) {
      this.openPanel();
    } else {
      this.search['skipFocusEvent'] = false;
    }
  }

  public onListClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    const { group, option } = this.getGroupAndOptionFromUIEvent(event) || {};

    if (group && option) {
      this.zone.run(() => {
        this.onOptionClick(group, option);
      });
      return;
    }

    if (target.matches('.bms-show-more') && group) {
      this.zone.run(() => {
        this.onShowMoreClick(group);
      });
      return;
    }

    event.preventDefault();
    this.focusSearchInput();
  }

  public onListKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;

    if (
      !target.matches('.bms-option') ||
      !controlKeys.includes(event.key as Keys)
    ) {
      return;
    }

    const { group, option } = this.getGroupAndOptionFromUIEvent(event) || {};

    if (isKey(event.key, Keys.arrowdown) || isKey(event.key, Keys.arrowright)) {
      event.preventDefault();
      this.findSiblingOptionEl(target, 'next')?.focus();
      return;
    }

    if (isKey(event.key, Keys.arrowup) || isKey(event.key, Keys.arrowleft)) {
      event.preventDefault();
      this.findSiblingOptionEl(target, 'prev')?.focus();
      return;
    }

    if (clickKeys.includes(event.key as Keys)) {
      if (group && option) {
        this.onOptionClick(group, option);
        return;
      }

      if (group) {
        this.onShowMoreClick(group);
      }
    }
  }

  private filterOptions(
    searchValue: string = '',
    groupOptions: MultiSearchGroupOption[] = this.options
  ): MultiSearchGroupOption[] {
    if (
      searchValue.length <
      (this.minSearchLength || MULTI_SEARCH_MIN_SEARCH_LENGTH_DEF)
    ) {
      return (
        this.searchOptionsEmpty ||
        (this.searchOptionsEmpty = groupOptions.map((group) => ({
          ...group,
          [group.keyMap?.options || MULTI_SEARCH_KEYMAP_DEF.options]: [],
        })))
      );
    }

    const matcher = new RegExp(escapeRegExp(searchValue), 'i');

    const filtered = groupOptions.reduce(
      (msgo: MultiSearchGroupOption[], group) => {
        const options = group[
          group.keyMap?.options || MULTI_SEARCH_KEYMAP_DEF.options
        ].filter((option: MultiSearchOption) =>
          matcher.test(
            option[group.keyMap?.value || MULTI_SEARCH_KEYMAP_DEF.value]
          )
        );

        if (options.length) {
          msgo.push({
            ...group,
            [group.keyMap?.options || MULTI_SEARCH_KEYMAP_DEF.options]: options,
          });
        }

        return msgo;
      },
      []
    );

    return filtered.length ? filtered : this.searchOptionsEmpty;
  }

  private onOptionClick(
    group: MultiSearchGroupOption,
    option: MultiSearchOption
  ): void {
    if (isFunction(group.optionClickHandler)) {
      group.optionClickHandler(option);
    }

    if (this.clicked.observers.length) {
      this.clicked.emit({
        group,
        option,
      });
    }

    this.closePanel();
  }

  private onShowMoreClick(group: MultiSearchGroupOption): void {
    group.showItems =
      (group.showItems || this.showItems || MULTI_SEARCH_SHOW_ITEMS_DEF) +
      (this.showItems || MULTI_SEARCH_SHOW_ITEMS_DEF);

    this.focusSearchInput();
  }
}

import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  NgZone,
} from '@angular/core';
import {
  MultiSearchGroupOption,
  MultiSearchOption,
} from './multi-search.interface';
import {
  MULTI_SEARCH_KEYMAP_DEF,
  MULTI_SEARCH_MIN_SEARCH_LENGTH_DEF,
} from './multi-search.const';
import {
  isFunction,
  isKey,
  asArray,
} from '../../services/utils/functional-utils';
import { ListPanelService } from '../../lists/list-panel.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { MultiSearchBaseElement } from './multi-search.abstract';
import { Keys, clickKeys, controlKeys, arrowKeys } from '../../enums';

@Component({
  selector: 'b-multi-search',
  templateUrl: './multi-search.component.html',
  styleUrls: ['./multi-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSearchComponent extends MultiSearchBaseElement {
  constructor(
    public viewContainerRef: ViewContainerRef,
    public cd: ChangeDetectorRef,
    protected DOM: DOMhelpers,
    protected listPanelSrvc: ListPanelService,
    private zone: NgZone
  ) {
    super(viewContainerRef, cd, DOM, listPanelSrvc);
  }

  @Input('showAll')
  set setShowAll(showAll: boolean) {
    this.showAll = showAll;
    if (showAll && this.options) {
      this.searchOptions = this.options.map(this.groupShowItemsMapper);
    }
  }
  private showAll = false;

  @Input('options') set setOptions(groupOptions: MultiSearchGroupOption[]) {
    this.options = groupOptions || [];
    this.searchOptionsEmpty = undefined;

    this.searchOptions = this.showAll
      ? this.options.map(this.groupShowItemsMapper)
      : this.filterOptions(this.searchValue, this.options);
  }

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

  public onSearchKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;

    if (target !== this.search.input.nativeElement) {
      return;
    }

    if (
      isKey(event.key, Keys.tab) ||
      ((isKey(event.key, Keys.arrowdown) ||
        isKey(event.key, Keys.arrowright)) &&
        target.selectionStart === target.value.length)
    ) {
      if (this.focusFirstOption()) {
        event.preventDefault();
      }
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
        this.onShowMoreClick(group, target);
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

    if (arrowKeys.includes(event.key as Keys)) {
      event.preventDefault();
      const sibling = this.findSiblingOptionEl(
        target,
        isKey(event.key, Keys.arrowdown) || isKey(event.key, Keys.arrowright)
          ? 'next'
          : 'prev'
      );
      sibling?.focus();

      if (
        !sibling &&
        (isKey(event.key, Keys.arrowup) || isKey(event.key, Keys.arrowleft))
      ) {
        this.focusSearchInput();
      }

      return;
    }

    if (clickKeys.includes(event.key as Keys)) {
      event.preventDefault();

      if (group && option) {
        this.onOptionClick(group, option);
        return;
      }

      if (group) {
        this.onShowMoreClick(group, target);
      }
    }
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
    this.search.onResetClick();
  }

  private onShowMoreClick(
    group: MultiSearchGroupOption,
    target: HTMLElement = null
  ): void {
    const prevOptionEl = this.DOM.getPrevSibling(target, '.bms-option');

    group.showItems = this.getOptionsSliceLength(group);

    const allGroupOptionsShown = Boolean(
      group.showItems >=
        group[group.keyMap?.options || MULTI_SEARCH_KEYMAP_DEF.options].length
    );

    const elementToFocus =
      this.lastFocusedOption ||
      (allGroupOptionsShown && prevOptionEl) ||
      undefined;

    elementToFocus?.focus();

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        (elementToFocus || prevOptionEl)?.scrollIntoView({});
      }, 0);
    });
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
        (this.searchOptionsEmpty = groupOptions.map((group) => {
          delete group.searchMatchCount;

          return {
            ...group,
            [group.keyMap?.options || MULTI_SEARCH_KEYMAP_DEF.options]: [],
          };
        }))
      );
    }

    const matcher = new RegExp(
      searchValue
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\*\[\]\+><@\s]+/g, '')
        .split('')
        .join('[.,\\/#!$%\\^&\\*;:{}=\\-_`~()\\*\\[\\]\\+><@\\s]*'),
      'i'
    );

    const filtered = groupOptions.reduce(
      (msgo: MultiSearchGroupOption[], group) => {
        const options: MultiSearchOption[] = group[
          group.keyMap?.options || MULTI_SEARCH_KEYMAP_DEF.options
        ].filter((option: MultiSearchOption) => {
          let searchValueIndex = 0,
            valueToMatch =
              option[group.keyMap?.value || MULTI_SEARCH_KEYMAP_DEF.value],
            match: RegExpExecArray,
            highlightedMatch: string;

          if (option.searchValue) {
            option.searchValue = asArray(option.searchValue);

            searchValueIndex = option.searchValue.findIndex((sv) =>
              matcher.test(String(sv))
            );

            if (searchValueIndex === -1) {
              delete option.searchMatch;
              return false;
            }

            valueToMatch = String(option.searchValue[searchValueIndex]);
          }

          match = matcher.exec(valueToMatch);

          if (!match) {
            delete option.searchMatch;
            return false;
          }

          highlightedMatch =
            valueToMatch.slice(0, match.index) +
            '<strong>' +
            valueToMatch.slice(match.index, match.index + match['0'].length) +
            '</strong>' +
            valueToMatch.slice(match.index + match['0'].length);

          option.searchMatch = {
            index: [searchValueIndex, match.index],
            [valueToMatch ===
            option[group.keyMap?.value || MULTI_SEARCH_KEYMAP_DEF.value]
              ? 'highlightedValue'
              : 'highlightedSearchValue']: highlightedMatch,
          };

          return true;
        });

        if (options.length) {
          group.searchMatchCount = options.length;

          options.sort((a, b) => {
            return a.searchMatch.index[0] !== b.searchMatch.index[0]
              ? a.searchMatch.index[0] - b.searchMatch.index[0]
              : a.searchMatch.index[1] - b.searchMatch.index[1];
          });

          msgo.push({
            ...group,
            [group.keyMap?.options || MULTI_SEARCH_KEYMAP_DEF.options]: options,
            showItems: this.getOptionsSliceLength(group, options),
          });
        } else {
          delete group.searchMatchCount;
        }

        return msgo;
      },
      []
    );

    return filtered.length ? filtered : this.searchOptionsEmpty;
  }
}

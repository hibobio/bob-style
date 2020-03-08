import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
  SimpleChanges,
  Input,
} from '@angular/core';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import {
  joinArrays,
  stringify,
  isBoolean,
  isNotEmptyArray,
  hasChanges,
  firstChanges,
  notFirstChanges,
  isNotEmptyMap,
  isEmptyArray,
} from '../../../services/utils/functional-utils';
import { selectValueOrFail } from '../../../services/utils/transformers';
import { SelectType } from '../../list.enum';
import {
  itemID,
  TreeListItem,
  TreeListOption,
  TreeListItemMap,
} from '../tree-list.interface';
import { TreeListModelService } from '../services/tree-list-model.service';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import {
  TreeListViewService,
  TreeListChildrenToggleSelectReducerResult,
} from '../services/tree-list-view.service';
import { BaseTreeListElement } from './tree-list.abstract';
import { BehaviorSubject } from 'rxjs';
import { TreeListValueService } from '../services/tree-list-value.service';
import { TreeListSearchService } from '../services/tree-list-search.service';

@Component({
  selector: 'b-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeListComponent extends BaseTreeListElement {
  constructor(
    modelSrvc: TreeListModelService,
    cntrlsSrvc: TreeListControlsService,
    viewSrvc: TreeListViewService,
    valueSrvc: TreeListValueService,
    searchSrvc: TreeListSearchService,
    DOM: DOMhelpers,
    cd: ChangeDetectorRef,
    zone: NgZone,
    host: ElementRef
  ) {
    super(
      modelSrvc,
      cntrlsSrvc,
      viewSrvc,
      valueSrvc,
      searchSrvc,
      DOM,
      cd,
      zone,
      host
    );
  }

  @Input('list') set setList(list: TreeListOption[]) {}
  public list: TreeListOption[];
  @Input('value') set setValue(value: itemID[]) {}
  public value: itemID[];
  @Input('itemsMap') set setItemsMap(itmsMap: TreeListItemMap) {
    if (isNotEmptyMap(itmsMap)) {
      this.itemsMap = itmsMap;
      this.itemsMapFromAbove = true;
    }
  }

  public $listViewModel: BehaviorSubject<itemID[]> = new BehaviorSubject<
    itemID[]
  >([]);

  public onNgChanges(changes: SimpleChanges): void {
    let viewModelWasUpdated = false;

    if (hasChanges(changes, ['list'], true)) {
      this.list = changes.list.currentValue || [];

      if (!this.itemsMapFromAbove) {
        console.time('getListItemsMap');
        this.itemsMap.clear();
        this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
          keyMap: this.keyMap,
          separator: this.valueSeparatorChar,
          collapsed: this.startCollapsed,
        });
        console.timeEnd('getListItemsMap');
      }
    }

    if (hasChanges(changes, ['list', 'itemsMap'], true)) {
      this.hidden = this.itemsMap.size === 0;
      this.showSearch = this.itemsMap.size > 10;
    }

    if (firstChanges(changes, ['list', 'itemsMap'])) {
      console.log('first change updateListViewModel');
      this.updateListViewModel();
      viewModelWasUpdated = true;
    }

    if (
      hasChanges(changes, ['list', 'itemsMap'], true) ||
      hasChanges(changes, ['value'])
    ) {
      viewModelWasUpdated =
        this.applyValue(
          (changes.value ? changes.value.currentValue : this.value) || []
        ) || viewModelWasUpdated;
    }

    if (
      notFirstChanges(changes, ['startCollapsed']) &&
      isBoolean(this.startCollapsed)
    ) {
      this.toggleCollapseAll(this.startCollapsed, false);
    }

    if (notFirstChanges(changes, ['type']) && this.type === SelectType.single) {
      const newValue = isNotEmptyArray(this.value) ? [this.value[0]] : [];
      this.viewSrvc.deselectAllExcept(this.value, newValue, this.itemsMap);
      this.value = newValue;
    }

    if (
      !viewModelWasUpdated &&
      (hasChanges(changes, ['list', 'itemsMap', 'viewFilter'], true) ||
        hasChanges(changes, ['value', 'startCollapsed']))
    ) {
      this.updateListViewModel();
    }
  }

  protected updateListViewModel(expand = false): void {
    console.time('===> updateListViewModel');
    this.listViewModel = this.modelSrvc.getListViewModel(
      this.list,
      this.itemsMap,
      {
        viewFilter: this.viewFilter,
        expand,
        keyMap: this.keyMap,
      }
    );
    console.timeEnd('===> updateListViewModel');

    console.time('updateListViewModel detectChanges');

    this.$listViewModel.next(this.listViewModel);

    // if (!this.cd['destroyed']) {
    //   this.cd.detectChanges();
    // }
    console.timeEnd('updateListViewModel detectChanges');
  }

  protected toggleItemCollapsed(
    item: TreeListItem,
    element: HTMLElement
  ): void {
    let elOffset: number;

    if (!item.collapsed) {
      elOffset = element.offsetTop;
    }

    item.collapsed = !item.collapsed;

    if (item.collapsed) {
      this.cd.detectChanges();
      this.listElement.nativeElement.scrollTop =
        this.listElement.nativeElement.scrollTop -
        (elOffset - element.offsetTop);
    }

    this.updateListViewModel();
  }

  protected toggleItemSelect(item: TreeListItem, force: boolean = null): void {
    console.time('toggleItemSelect');
    const newSelectedValue = isBoolean(force) ? force : !item.selected;
    if (newSelectedValue === item.selected) {
      return;
    }

    item.selected = newSelectedValue;

    if (this.type === SelectType.single) {
      item.selected = newSelectedValue;

      if (item.selected) {
        if (this.value.length && this.value[0] !== item.id) {
          const prevSelectedItem = this.itemsMap.get(this.value[0]);
          prevSelectedItem.selected = false;

          this.viewSrvc.updateItemParentsSelectedCount(
            prevSelectedItem,
            this.itemsMap
          );
        }
        this.value = [item.id];
      } else {
        this.value = [];
      }
    }

    if (this.type === SelectType.multi) {
      if (item.childrenCount) {
        const deselected: TreeListChildrenToggleSelectReducerResult = item.childrenIDs.reduce(
          this.viewSrvc.childrenToggleSelectReducer(
            item.selected,
            this.itemsMap
          ),
          undefined
        );

        this.value = this.value.filter(id => !deselected.IDs.includes(id));

        deselected.items.forEach((itm: TreeListItem) => {
          this.viewSrvc.updateItemParentsSelectedCount(itm, this.itemsMap);
        });
      }

      if (item.selected) {
        this.value.push(item.id);
      } else {
        this.value = this.value.filter(id => id !== item.id);
      }
    }

    this.viewSrvc.updateItemParentsSelectedCount(item, this.itemsMap);

    this.updateActionButtonsState();
    console.timeEnd('toggleItemSelect');

    console.time('toggleItemSelect detectChanges');
    this.cd.detectChanges();
    console.timeEnd('toggleItemSelect detectChanges');
    this.emitChange();
  }

  // returns true if listViewModel was updated
  protected applyValue(newValue: itemID[]): boolean {
    console.time('applyValue');
    //
    //
    //
    let viewModelWasUpdated = false;
    let affectedIDs: itemID[] = this.value || [];
    this.value = selectValueOrFail(newValue);
    if (this.value && this.type === SelectType.single) {
      this.value = this.value.slice(0, 1);
    }
    console.log('<=== applyValue:', this.value);

    if (!this.itemsMap.size) {
      return viewModelWasUpdated;
    }
    affectedIDs = joinArrays(affectedIDs, this.value || []);

    let firstSelectedItem: TreeListItem;

    affectedIDs.forEach(id => {
      const item = this.itemsMap.get(id);

      if (!item) {
        console.error(
          `[TreeListComponent.applyValue]:
          No item data for ID: "${stringify(id)}". Removing ID from value.`
        );
        this.value = this.value.filter(valId => valId !== id);
        return;
      }

      item.selected = !!newValue && this.value.includes(item.id);
      if (!firstSelectedItem && item.selected) {
        firstSelectedItem = item;
      }

      this.viewSrvc.updateItemParentsSelectedCount(item, this.itemsMap);
    });

    if (firstSelectedItem) {
      this.viewSrvc.expandTillItemsByID(this.value, this.itemsMap);

      this.updateListViewModel();
      viewModelWasUpdated = true;

      this.viewSrvc.scrollToItem({
        item: firstSelectedItem,
        listElement: this.listElement.nativeElement,
        listViewModel: this.listViewModel,
        maxHeightItems: this.maxHeightItems,
      });
    } else {
      console.time('applyValue, toggleCollapseAll');
      this.toggleCollapseAll(this.startCollapsed, false);
      this.listElement.nativeElement.scrollTop = 0;
      console.timeEnd('applyValue, toggleCollapseAll');
    }

    console.timeEnd('applyValue');
    return viewModelWasUpdated;
  }

  protected emitChange(): void {
    this.listActionsState.apply.disabled = false;

    if (isEmptyArray(this.value)) {
      this.changed.emit({
        selectedIDs: [],
        selectedValues: [],
      });
      return;
    }

    if (this.type === SelectType.multi) {
      this.value = this.valueSrvc.sortIDlistByItemIndex(
        this.value,
        this.itemsMap
      );
    }

    this.changed.emit({
      selectedIDs: this.value,
      selectedValues:
        this.type === SelectType.single
          ? [this.itemsMap.get(this.value[0]).value]
          : this.valueSrvc.getDisplayValuesFromValue(this.value, this.itemsMap),
    });
  }
}

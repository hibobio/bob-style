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
  isBoolean,
  isNotEmptyArray,
  hasChanges,
  firstChanges,
  notFirstChanges,
  isNotEmptyMap,
  isEmptyArray,
  isValuevy,
} from '../../../services/utils/functional-utils';
import { SelectType } from '../../list.enum';
import {
  itemID,
  TreeListItem,
  TreeListOption,
  TreeListItemMap,
} from '../tree-list.interface';
import { TreeListModelService } from '../services/tree-list-model.service';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import { TreeListViewService } from '../services/tree-list-view.service';
import { BaseTreeListElement } from './tree-list.abstract';
import { BehaviorSubject } from 'rxjs';
import { TreeListValueUtils } from '../services/tree-list-value.static';
import { MobileService } from '../../../services/utils/mobile.service';

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
    mobileService: MobileService,
    DOM: DOMhelpers,
    cd: ChangeDetectorRef,
    zone: NgZone,
    host: ElementRef
  ) {
    super(modelSrvc, cntrlsSrvc, viewSrvc, mobileService, DOM, cd, zone, host);
    this.listActions = {
      apply: false,
      cancel: false,
      clear: false,
      reset: false,
    };
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
        this.itemsMap.clear();
        this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
          keyMap: this.keyMap,
          separator: this.valueSeparatorChar,
          collapsed: this.startCollapsed,
        });
      }
    }

    if (hasChanges(changes, ['list', 'itemsMap'], true)) {
      this.hidden = this.itemsMap.size < 2;
      this.showSearch = this.itemsMap.size > 11;
    }

    if (firstChanges(changes, ['list', 'itemsMap'], true)) {
      this.updateListViewModel();
      viewModelWasUpdated = true;
    }

    if (
      hasChanges(changes, ['list', 'itemsMap', 'value'], true, {
        falseyCheck: isValuevy,
      })
    ) {
      viewModelWasUpdated =
        this.applyValue(
          (changes.value ? changes.value.currentValue : this.value) || []
        ) || viewModelWasUpdated;
    }

    if (
      notFirstChanges(changes, ['startCollapsed'], true, {
        falseyCheck: isBoolean,
      })
    ) {
      this.toggleCollapseAll(this.startCollapsed, false);
    }

    if (
      notFirstChanges(changes, ['type'], true) &&
      this.type === SelectType.single
    ) {
      viewModelWasUpdated =
        this.applyValue(isNotEmptyArray(this.value) ? [this.value[0]] : []) ||
        viewModelWasUpdated;
    }

    if (
      !viewModelWasUpdated &&
      hasChanges(
        changes,
        ['list', 'itemsMap', 'viewFilter', 'value', 'startCollapsed'],
        true,
        {
          falseyCheck: isValuevy,
        }
      )
    ) {
      this.updateListViewModel();
    }
  }

  protected updateListViewModel(expand = false): void {
    this.listViewModel = this.modelSrvc.getListViewModel(
      this.list,
      this.itemsMap,
      {
        viewFilter: this.viewFilter,
        expand,
        keyMap: this.keyMap,
      }
    );

    this.$listViewModel.next(this.listViewModel);
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
    const newSelectedValue = isBoolean(force) ? force : !item.selected;
    if (newSelectedValue === item.selected) {
      return;
    }

    item.selected = newSelectedValue;

    if (this.type === SelectType.single) {
      this.value = item.selected ? [item.id] : [];
    }

    if (this.type === SelectType.multi) {
      if (item.selected) {
        this.value.push(item.id);
      } else {
        this.value = this.value.filter(id => id !== item.id);
      }
    }

    this.applyValue(this.value, false);

    this.updateActionButtonsState();
    this.cd.detectChanges();
    this.emitChange();
  }

  // returns true if listViewModel was updated
  protected applyValue(newValue: itemID[], adjustView = true): boolean {
    let viewModelWasUpdated = false;

    if (this.itemsMap.size < 2 || newValue === undefined) {
      return viewModelWasUpdated;
    }

    const mapUpdateResult = this.modelSrvc.applyValueToMap(
      newValue,
      this.itemsMap,
      this.type
    );

    this.value = mapUpdateResult.value;

    if (adjustView) {
      const { firstSelectedItem } = mapUpdateResult;

      if (firstSelectedItem) {
        this.viewSrvc.expandTillItemsByID(this.value, this.itemsMap);
        this.updateListViewModel();
        viewModelWasUpdated = true;
        this.cd.detectChanges();

        this.viewSrvc.scrollToItem({
          item: firstSelectedItem,
          listElement: this.listElement.nativeElement,
          listViewModel: this.listViewModel,
          maxHeightItems: this.maxHeightItems,
        });
      } else {
        this.listElement.nativeElement.scrollTop = 0;
      }
    }

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
      this.value = TreeListValueUtils.sortIDlistByItemIndex(
        this.value,
        this.itemsMap
      );
    }

    this.changed.emit({
      selectedIDs: this.value,
      selectedValues:
        this.type === SelectType.single
          ? [this.itemsMap.get(this.value[0]).value]
          : TreeListValueUtils.getDisplayValuesFromValue(
              this.value,
              this.itemsMap
            ),
    });
  }
}

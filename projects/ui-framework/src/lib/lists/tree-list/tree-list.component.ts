import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  joinArrays,
  stringify,
  isBoolean,
  isNotEmptyArray,
  applyChanges,
  hasChanges,
  firstChanges,
  notFirstChanges,
  objectHasTruthyValue,
} from '../../services/utils/functional-utils';
import { selectValueOrFail } from '../../services/utils/transformers';
import { SelectType } from '../list.enum';
import { itemID, TreeListItem } from './tree-list.interface';
import { TreeListModelService } from './services/tree-list-model.service';
import { TreeListControlsService } from './services/tree-list-controls.service';
import { TreeListViewService } from './services/tree-list-view.service';
import { BaseTreeListElement } from './tree-list.abstract';
import { BTL_KEYMAP_DEF, BTL_ROOT_ID } from './tree-list.const';

@Component({
  selector: 'b-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeListComponent extends BaseTreeListElement
  implements OnChanges {
  constructor(
    modelSrvc: TreeListModelService,
    cntrlsSrvc: TreeListControlsService,
    viewSrvc: TreeListViewService,
    DOM: DOMhelpers,
    cd: ChangeDetectorRef,
    zone: NgZone,
    host: ElementRef
  ) {
    super(modelSrvc, cntrlsSrvc, viewSrvc, DOM, cd, zone, host);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log('---------------', 'Tree LIST ngOnChanges', changes);

    console.time('ngOnChanges');
    let viewModelWasUpdated = false;

    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
      },
      ['list', 'value'],
      false,
      { list: 'setList', value: 'setValue' }
    );

    if (hasChanges(changes, ['keyMap'], true)) {
      this.keyMap = { ...BTL_KEYMAP_DEF, ...this.keyMap };
    }

    if (
      (hasChanges(changes, ['list'], true) &&
        changes.list.currentValue !== this.list) ||
      hasChanges(changes, ['showSingleGroupHeader'])
    ) {
      if (changes.list) {
        this.list = changes.list.currentValue;
        this.hidden = !this.list.length;
      }

      if (
        !this.showSingleGroupHeader &&
        isNotEmptyArray(this.list, 1) &&
        this.list[0][this.keyMap.children]
      ) {
        this.list = this.list[0][this.keyMap.children];
      }

      console.time('getListItemsMap');
      this.itemsMap.clear();
      this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
        keyMap: this.keyMap,
        separator: this.valueSeparatorChar,
        collapsed: this.startCollapsed,
      });
      console.timeEnd('getListItemsMap');

      this.showSearch = this.itemsMap.size > 10;
    }

    if (hasChanges(changes, ['value'])) {
      console.log('LIST CHNGES VALUE', changes.value.currentValue);
    }

    if (hasChanges(changes, ['list'], true) || hasChanges(changes, ['value'])) {
      if (firstChanges(changes, ['list'])) {
        this.updateListViewModel();
        viewModelWasUpdated = true;
      }

      viewModelWasUpdated =
        this.applyValue(
          changes.value ? changes.value.currentValue : this.value
        ) || viewModelWasUpdated;
    }

    if (
      notFirstChanges(changes, ['startCollapsed']) &&
      typeof this.startCollapsed === 'boolean'
    ) {
      this.toggleCollapseAll(this.startCollapsed, false);
    }

    if (hasChanges(changes, ['valueDefault'], true)) {
      const defaultsExist = isNotEmptyArray(this.valueDefault);
      this.listActions.clear = !defaultsExist;
      this.listActions.reset = defaultsExist;
    }

    if (
      hasChanges(changes, ['list', 'valueDefault'], true) ||
      hasChanges(changes, ['showSingleGroupHeader', 'value'])
    ) {
      this.updateActionButtonsState();
    }

    if (
      notFirstChanges(changes, ['type']) &&
      this.type !== SelectType.multi &&
      isNotEmptyArray(this.value)
    ) {
      this.modelSrvc.deselectAllItemsInMap(this.itemsMap);
    }

    if (notFirstChanges(changes, ['listActions'])) {
      this.hasFooter = !this.readonly && objectHasTruthyValue(this.listActions);
    }

    if (
      !viewModelWasUpdated &&
      (hasChanges(changes, ['list', 'viewFilter'], true) ||
        hasChanges(changes, [
          'value',
          'startCollapsed',
          'showSingleGroupHeader',
        ]))
    ) {
      this.updateListViewModel();
    }

    if (hasChanges(changes, ['maxHeightItems', 'list'], true)) {
      this.DOM.setCssProps(this.host.nativeElement, {
        '--list-max-items': Math.max(
          this.itemsMap.size > 0
            ? this.itemsMap.get(BTL_ROOT_ID).groupsCount + 3
            : 0,
          this.maxHeightItems
        ),
      });
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
    console.timeEnd('ngOnChanges');
  }

  protected updateListViewModel(expand = false): void {
    console.time('updateListViewModel');
    this.listViewModel.length = 0;

    this.listViewModel.push(
      ...this.modelSrvc.getListViewModel(this.list, this.itemsMap, {
        viewFilter: this.viewFilter,
        expand,
        keyMap: this.keyMap,
      })
    );

    console.log('===> updateListViewModel');

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
    console.timeEnd('updateListViewModel');
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

  protected toggleItemSelect(
    item: TreeListItem,
    force: boolean = null,
    set: Partial<TreeListItem> = {}
  ): void {
    const newSelectedValue = isBoolean(force) ? force : !item.selected;
    if (newSelectedValue === item.selected) {
      return;
    }
    item.selected = newSelectedValue;

    if (this.type === SelectType.single) {
      if (item.selected) {
        console.log('single select');

        if (this.value && this.value[0] && this.value[0] !== item.id) {
          console.log('deselecting', this.value[0]);
          this.itemsMap.get(this.value[0]).selected = false;
        }
        this.value = [item.id];
      } else {
        this.value = [];
      }

      this.emitChange();
    }

    // this.cd.detectChanges();

    if (this.type !== SelectType.multi) {
      return;
    }

    item.selected = newSelectedValue;

    // if group

    if (item.childrenCount) {
      if (item.selected && item.selectedCount) {
        item.selectedIDs.forEach(id => {
          this.toggleItemSelect(this.itemsMap.get(id), false, {
            parentSelected: true,
          });
        });
      }
    }

    // update parent counters

    item.parentIDs.forEach(groupID => {
      const parent = this.itemsMap.get(groupID);
      parent.selectedCount = Math.max(
        0,
        (parent.selectedCount || 0) + (item.selected ? 1 : -1)
      );

      if (item.selected) {
        parent.selectedIDs.push(item.id);
      } else {
        parent.selectedIDs = parent.selectedIDs.filter(id => id !== item.id);
      }
    });

    // if option

    if (!item.childrenCount) {
      if (item.selected) {
        this.value.push(item.id);
      } else {
        this.value = this.value.filter(id => id !== item.id);
      }
    }

    // item.selected = !item.selected;

    // for (const groupID of item.parentIDs) {
    //   const parent = this.itemsMap.get(groupID);
    //   parent.selectedCount = parent.selectedCount + (item.selected ? 1 : -1);

    //   parent.selected = parent.selectedCount === parent.childrenCount;

    //   parent.indeterminate = !parent.selected && !!parent.selectedCount;
    // }

    this.updateActionButtonsState();
    this.cd.detectChanges();
    this.emitChange();
  }

  // returns true if listViewModel was updated
  protected applyValue(newValue: itemID[]): boolean {
    console.time('applyValue');
    let affectedIDs: itemID[] = this.value || [];
    this.value = selectValueOrFail(newValue);
    if (this.value && this.type === SelectType.single) {
      this.value = this.value.slice(0, 1);
    }
    let viewModelWasUpdated = false;
    console.log('<=== applyValue:', this.value);

    if (!this.itemsMap.size) {
      return viewModelWasUpdated;
    }
    affectedIDs = joinArrays(affectedIDs, this.value || []);

    let firstSelectedID: itemID;

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
      if (!firstSelectedID && item.selected) {
        firstSelectedID = item.id;
      }
    });

    if (firstSelectedID) {
      const item = this.itemsMap.get(firstSelectedID);

      this.viewSrvc.expandAllSelected(this.value, this.itemsMap);
      this.updateListViewModel();
      viewModelWasUpdated = true;

      viewModelWasUpdated =
        this.viewSrvc.scrollToItem(item, {
          listViewModel: this.listViewModel,
          listElement: this.listElement.nativeElement,
          itemsMap: this.itemsMap,
          updateListViewModel: this.updateListViewModel.bind(this),
        }) || viewModelWasUpdated;
    } else {
      this.toggleCollapseAll(this.startCollapsed);
      this.listElement.nativeElement.scrollTop = 0;
      viewModelWasUpdated = true;
    }

    console.timeEnd('applyValue');
    return viewModelWasUpdated;
  }

  protected emitChange(): void {
    if (this.type === SelectType.single) {
      this.changed.emit({
        selectedIDs: this.value || [],
        selectedValues:
          this.value && this.value[0]
            ? [this.itemsMap.get(this.value[0]).value]
            : [],
      });

      return;
    }

    if (this.type === SelectType.multi) {
      if (isNotEmptyArray(this.value)) {
        this.value = this.modelSrvc.sortIDlistByItemIndex(
          this.itemsMap,
          this.value
        );
      }
      this.changed.emit({
        selectedIDs: this.value || [],
        selectedValues: isNotEmptyArray(this.value)
          ? this.value.map(id => this.itemsMap.get(id).value)
          : [],
      });
    }

    this.listActionsState.apply.disabled = false;
  }
}

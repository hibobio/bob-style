import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { LIST_MAX_ITEMS } from '../list.consts';
import { SelectMode, SelectType } from '../list.enum';
import { itemID, ListFooterActions } from '../list.interface';
import { BTL_KEYMAP_DEF, BTL_VALUE_SEPARATOR_DEF } from './tree-list.const';
import {
  TreeListComponentIO,
  TreeListItemMap,
  TreeListKeyMap,
  TreeListOption,
  TreeListValue,
  ViewFilter,
} from './tree-list.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class TreeListInputOutput implements TreeListComponentIO {
  @Input() id: string;
  @Input() list: TreeListOption[];
  @Input() value: itemID[];
  @Input() valueDefault: itemID[];
  @Input() viewFilter: ViewFilter;
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;
  @Input() itemsMap: TreeListItemMap = new Map();

  @Input() type: SelectType = SelectType.multi;
  @Input() mode: SelectMode = SelectMode.tree;
  @Input() valueSeparatorChar = BTL_VALUE_SEPARATOR_DEF;
  @Input() maxHeightItems = LIST_MAX_ITEMS;
  @Input() startCollapsed = true;
  @Input() focusOnInit = false;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() listActions: ListFooterActions = {
    apply: false,
    cancel: false,
    clear: false,
    reset: false,
  };

  @Output()
  changed: EventEmitter<TreeListValue> = new EventEmitter<TreeListValue>();
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
}

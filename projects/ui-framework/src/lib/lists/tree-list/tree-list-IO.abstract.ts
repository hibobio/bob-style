import { Input, Output, EventEmitter, Directive } from '@angular/core';
import {
  TreeListComponentIO,
  TreeListOption,
  itemID,
  ViewFilter,
  TreeListKeyMap,
  TreeListValue,
  TreeListItemMap,
} from './tree-list.interface';
import { BTL_KEYMAP_DEF, BTL_VALUE_SEPARATOR_DEF } from './tree-list.const';
import { SelectType, SelectMode } from '../list.enum';
import { ListFooterActions } from '../list.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class TreeListInputOutput implements TreeListComponentIO {
  @Input() list: TreeListOption[];
  @Input() value: itemID[];
  @Input() valueDefault: itemID[];
  @Input() viewFilter: ViewFilter;
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;
  @Input() itemsMap: TreeListItemMap = new Map();

  @Input() type: SelectType = SelectType.multi;
  @Input() mode: SelectMode = SelectMode.tree;
  @Input() valueSeparatorChar = BTL_VALUE_SEPARATOR_DEF;
  @Input() maxHeightItems = 8;
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
  @Input() debug = false;

  @Output() changed: EventEmitter<TreeListValue> = new EventEmitter<
    TreeListValue
  >();
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
}

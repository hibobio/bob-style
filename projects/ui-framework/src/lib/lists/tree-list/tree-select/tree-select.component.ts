import {
  Component,
  ChangeDetectorRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  forwardRef,
  SimpleChanges,
  OnDestroy,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseFormElement } from '../../../form-elements/base-form-element';
import {
  TreeListOption,
  ViewFilter,
  TreeListComponentIO,
  TreeListKeyMap,
  TreeListValue,
  TreeListItemMap,
} from '../tree-list.interface';
import { SelectType, SelectMode } from '../../list.enum';
import { itemID, ListFooterActions } from '../../list.interface';
import { TruncateTooltipType } from '../../../popups/truncate-tooltip/truncate-tooltip.enum';
import { OverlayRef } from '@angular/cdk/overlay';
import { TreeListPanelComponent } from '../tree-list-panel/tree-list-panel.component';
import { BTL_KEYMAP_DEF, BTL_VALUE_SEPARATOR_DEF } from '../tree-list.const';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import {
  hasChanges,
  isNotEmptyArray,
  isNotEmptyMap,
  notFirstChanges,
  applyChanges,
  isValuevy,
} from '../../../services/utils/functional-utils';
import { TooltipClass } from '../../../popups/tooltip/tooltip.enum';
import { TreeListPanelIO } from '../tree-list-panel/tree-list-panel.interface';
import { TreeListModelService } from '../services/tree-list-model.service';
import {
  selectValueOrFail,
  selectValueMultiOrSingle,
} from '../../../services/utils/transformers';
import { TreeListValueUtils } from '../services/tree-list-value.static';
import { PanelDefaultPosVer } from '../../../popups/panel/panel.enum';
import { LIST_ACTIONS_DEF } from '../../list-footer/list-footer.const';
import { SELECT_MAX_ITEMS } from '../../list.consts';

@Component({
  selector: 'b-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: [
    '../../../form-elements/input/input.component.scss',
    './tree-select.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: TreeSelectComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeSelectComponent extends BaseFormElement
  implements TreeListComponentIO, TreeListPanelIO, OnChanges, OnDestroy {
  constructor(private modelSrvc: TreeListModelService, cd: ChangeDetectorRef) {
    super(cd);
    this.baseValue = [];
    this.inputTransformers = [selectValueOrFail];
    this.wrapEvent = true;
    this.listActions = { ...LIST_ACTIONS_DEF };
  }

  @ViewChild(TreeListPanelComponent, { static: true })
  listPanel: TreeListPanelComponent;

  @Input() list: TreeListOption[];
  @Input('value') set setValue(value: itemID[]) {}
  public value: itemID[];
  @Input() valueDefault: itemID[];
  @Input() viewFilter: ViewFilter;
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

  @Input() type: SelectType = SelectType.multi;
  @Input() mode: SelectMode = SelectMode.tree;
  @Input() valueSeparatorChar = BTL_VALUE_SEPARATOR_DEF;
  @Input() startCollapsed = true;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() listActions: ListFooterActions;
  @Input() tooltipType: TruncateTooltipType = TruncateTooltipType.auto;
  @Input() debug = false;

  @Output() changed: EventEmitter<TreeListValue> = new EventEmitter<
    TreeListValue
  >();
  @Output() opened: EventEmitter<OverlayRef> = new EventEmitter<OverlayRef>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  public itemsMap: TreeListItemMap = new Map();
  public overlayRef: OverlayRef;
  public panelOpen = false;
  public displayValue: string;
  public displayValueCount: number;
  public panelPosition = PanelDefaultPosVer.belowLeftRight;
  public panelClass = 'b-tree-select-panel';
  public treeListValue: TreeListValue;
  readonly tooltipClass = [TooltipClass.PreWrap];
  public dirty = false;
  public touched = false;
  public maxHeightItems = SELECT_MAX_ITEMS;

  public ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
        type: SelectType.multi,
        valueSeparatorChar: BTL_VALUE_SEPARATOR_DEF,
        tooltipType: TruncateTooltipType.auto,
        mode: SelectMode.tree,
      },
      ['value'],
      true,
      {
        keyMap: { value: 'setValue' },
      }
    );

    if (
      this.mode === SelectMode.radioGroups ||
      this.mode === SelectMode.checkGroups
    ) {
      this.mode = SelectMode.tree;
    }

    if (hasChanges(changes, ['disabled', 'errorMessage', 'warnMessage'])) {
      this.closePanel();
    }

    if (hasChanges(changes, ['list'], true)) {
      this.itemsMap.clear();
      this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
        keyMap: this.keyMap,
        separator: this.valueSeparatorChar,
        collapsed: this.startCollapsed,
      });

      if (isNotEmptyArray(this.value) && !changes.value) {
        this.setDisplayValue(this.value);
      }
    }

    if (hasChanges(changes, ['value'])) {
      this.writeValue(changes.value.currentValue);
    }

    if (notFirstChanges(changes, ['type']) && this.type === SelectType.single) {
      this.writeValue(isNotEmptyArray(this.value) ? [this.value[0]] : []);
    }

    if (
      hasChanges(changes, null, true, {
        truthyCheck: isValuevy,
      }) &&
      !this.cd['destroyed']
    ) {
      this.cd.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.itemsMap.clear();
  }

  public onSelectChange(value: TreeListValue): void {
    this.treeListValue = value;
    this.setDisplayValue(this.treeListValue);
  }

  public onApply(): void {
    if (this.treeListValue) {
      this.value = this.treeListValue.selectedIDs || [];
      this.dirty = true;
      this.emitChange(this.treeListValue);
      this.treeListValue = undefined;
    }
  }

  public onCancel(): void {
    if (this.treeListValue) {
      this.writeValue(this.value);
      this.treeListValue = undefined;
    }
    this.closePanel();
  }

  private setDisplayValue(value: TreeListValue | itemID[] = null): void {
    const displayValues = TreeListValueUtils.getDisplayValuesFromValue(
      value,
      this.itemsMap,
      this.type === SelectType.multi
    );

    this.displayValue =
      (this.type === SelectType.single
        ? displayValues[0]
        : displayValues.join(',\n')) || '';
  }

  public writeValue(value: itemID[]) {
    if (value === undefined) {
      return;
    }
    if (isNotEmptyMap(this.itemsMap)) {
      const mapUpdateResult = this.modelSrvc.applyValueToMap(
        value,
        this.itemsMap,
        this.type
      );

      this.value = mapUpdateResult.value;
      this.setDisplayValue(this.value);
      this.cd.detectChanges();
    } else {
      super.writeValue(value);
    }
  }

  private emitChange(value: TreeListValue): void {
    this.transmitValue(selectValueMultiOrSingle(this.type, value.selectedIDs), {
      addToEventObj: {
        selectedValues: selectValueMultiOrSingle(
          this.type,
          value.selectedValues
        ),
      },
      eventObjValueKey: 'selectedIDs',
      eventObjOmitEventType: true,
    });
  }

  public openPanel(): void {
    if (this.listPanel && !this.disabled) {
      this.listPanel.openPanel();
    }
  }

  public closePanel(): void {
    if (this.listPanel) {
      this.listPanel.closePanel();
    }
  }

  public onPanelOpen(overlayRef: OverlayRef): void {
    this.overlayRef = overlayRef;
    this.panelOpen = true;
    if (this.opened.observers.length) {
      this.opened.emit(this.overlayRef);
    }
  }

  public onPanelClose(): void {
    this.touched = true;
    this.overlayRef = null;
    this.panelOpen = false;
    if (this.closed.observers.length) {
      this.closed.emit();
    }
  }
}

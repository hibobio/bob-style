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
  itemID,
  ViewFilter,
  TreeListComponentIO,
  TreeListKeyMap,
  TreeListValue,
  TreeListItemMap,
} from '../tree-list.interface';
import { SelectType } from '../../list.enum';
import { ListFooterActions } from '../../list.interface';
import { TruncateTooltipType } from '../../../popups/truncate-tooltip/truncate-tooltip.enum';
import { OverlayRef } from '@angular/cdk/overlay';
import { TreeListPanelComponent } from '../tree-list-panel/tree-list-panel.component';
import { BTL_KEYMAP_DEF } from '../tree-list.const';
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
  SelectValueMultiOrSingle,
} from '../../../services/utils/transformers';
import { TreeListViewService } from '../services/tree-list-view.service';
import { TreeListValueUtils } from '../services/tree-list-value.static';
import { TreeListModelUtils } from '../services/tree-list-model.static';
import { PanelDefaultPosVer } from '../../../popups/panel/panel.enum';

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
  constructor(
    private modelSrvc: TreeListModelService,
    private viewSrvc: TreeListViewService,
    cd: ChangeDetectorRef
  ) {
    super(cd);
    this.baseValue = [];
    this.inputTransformers = [selectValueOrFail];
    this.wrapEvent = true;
  }

  @ViewChild(TreeListPanelComponent, { static: true })
  listPanel: TreeListPanelComponent;

  @Input() list: TreeListOption[];
  @Input('value') set setValue(value: itemID[]) {}
  public value: itemID[];
  @Input() valueDefault: itemID[];
  @Input() viewFilter: ViewFilter;
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

  @Input() type: SelectType = SelectType.single;
  @Input() valueSeparatorChar = '/';
  @Input() maxHeightItems = 8;
  @Input() startCollapsed = true;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() listActions: ListFooterActions = {
    apply: true,
    cancel: true,
    clear: true,
    reset: false,
  };
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

  public ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', changes);
    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
      },
      ['value'],
      true,
      {
        keyMap: { value: 'setValue' },
      }
    );

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
      const newValue = isNotEmptyArray(this.value) ? [this.value[0]] : [];
      TreeListModelUtils.deselectAllExcept(
        this.treeListValue ? this.treeListValue.selectedIDs : this.value,
        newValue,
        this.itemsMap
      );
      this.value = newValue;
      this.setDisplayValue(this.value);
    }

    if (
      hasChanges(changes, null, true, {
        falseyCheck: isValuevy,
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
      TreeListModelUtils.deselectAllExcept(
        this.treeListValue.selectedIDs,
        this.value,
        this.itemsMap
      );
      this.setDisplayValue(this.value);
      this.treeListValue = undefined;
    }
    this.closePanel();
  }

  private setDisplayValue(
    value: TreeListValue | itemID[] = null,
    updateCount = false
  ): void {
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
    const previousValue = this.value || [];

    super.writeValue(value, false, () => {
      if (isNotEmptyMap(this.itemsMap)) {
        //
        // need to
        //
        // (this.value || []).forEach(id => {
        //   const item = this.itemsMap.get(id);
        //   item.selected = true;

        //   console.log('update count', item);
        //   TreeListModelUtils.updateItemParentsSelectedCount(
        //     item,
        //     this.itemsMap
        //   );
        // });

        console.log(
          '\n----------- SELECT -----------\n',
          'writeValue',
          'old value',
          previousValue,
          'new value',
          this.value
        );

        this.modelSrvc.applyValueToMap(this.value, this.itemsMap, this.type);

        this.setDisplayValue(this.value);
      }
    });
  }

  private emitChange(value: TreeListValue): void {
    this.transmitValue(SelectValueMultiOrSingle(this.type, value.selectedIDs), {
      addToEventObj: {
        selectedValues: SelectValueMultiOrSingle(
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

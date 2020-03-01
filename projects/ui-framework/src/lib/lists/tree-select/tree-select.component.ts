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
import { BaseFormElement } from '../../form-elements/base-form-element';
import {
  TreeListOption,
  itemID,
  ViewFilter,
  TreeListComponentIO,
  TreeListKeyMap,
  TreeListValue,
  TreeListItemMap,
} from '../tree-list/tree-list.interface';
import { SelectType } from '../list.enum';
import { ListFooterActions } from '../list.interface';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { OverlayRef } from '@angular/cdk/overlay';
import { TreeListPanelComponent } from '../tree-list-panel/tree-list-panel.component';
import { BTL_KEYMAP_DEF } from '../tree-list/tree-list.const';
import {
  BELOW_START,
  ABOVE_START,
  BELOW_END,
  ABOVE_END,
} from '../../popups/panel/panel-position-service/panel-position.const';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import {
  hasChanges,
  isNotEmptyArray,
  isNotEmptyMap,
  notFirstChanges,
  applyChanges,
} from '../../services/utils/functional-utils';
import { TooltipClass } from '../../popups/tooltip/tooltip.enum';
import { TreeListPanelIO } from '../tree-list-panel/tree-list-panel.interface';
import { TreeListModelService } from '../tree-list/services/tree-list-model.service';
import { selectValueOrFail } from '../../services/utils/transformers';

@Component({
  selector: 'b-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
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
  public panelPosition = [BELOW_START, ABOVE_START, BELOW_END, ABOVE_END];
  public panelClass = 'b-tree-select-panel';
  public treeListValue: TreeListValue;
  readonly tooltipClass = [TooltipClass.PreWrap];
  public dirty = false;
  public touched = false;

  public ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
      },
      ['value'],
      false,
      {
        keyMap: { value: 'setValue' },
      }
    );

    if (hasChanges(changes, ['disabled', 'errorMessage', 'warnMessage'])) {
      this.closePanel();
    }

    if (hasChanges(changes, ['list'], true)) {
      console.time('TreeSelectComponent getListItemsMap');
      this.itemsMap.clear();
      this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
        keyMap: this.keyMap,
        separator: this.valueSeparatorChar,
        collapsed: this.startCollapsed,
      });
      console.timeEnd('TreeSelectComponent getListItemsMap');

      if (isNotEmptyArray(this.value) && !changes.value) {
        this.setDisplayValue(this.value);
      }
    }

    if (hasChanges(changes, ['value'])) {
      this.writeValue(changes.value.currentValue);
    }

    if (notFirstChanges(changes, ['type']) && this.type === SelectType.single) {
      const newValue = isNotEmptyArray(this.value) ? [this.value[0]] : [];
      this.modelSrvc.deselectAllExcept(
        this.treeListValue ? this.treeListValue.selectedIDs : this.value,
        newValue,
        this.itemsMap
      );
      this.value = newValue;
      this.setDisplayValue(this.value);
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
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
      this.modelSrvc.deselectAllExcept(
        this.treeListValue.selectedIDs,
        this.value,
        this.itemsMap
      );
      this.setDisplayValue(this.value);
      this.treeListValue = undefined;
    }
    this.closePanel();
  }

  private setDisplayValue(value: TreeListValue | itemID[] = null): void {
    const selectedValues = this.modelSrvc.getDisplayValuesFromValue(
      value,
      this.itemsMap
    );
    this.displayValue =
      (this.type === SelectType.single
        ? selectedValues[0]
        : selectedValues.join(',\n')) || '';
  }

  public writeValue(value: itemID[]) {
    console.time('<====== TreeSelectComponent writeValue');

    super.writeValue(value);

    if (isNotEmptyMap(this.itemsMap)) {
      this.setDisplayValue(this.value);
    }
    console.timeEnd('<====== TreeSelectComponent writeValue');
  }

  private emitChange(value: TreeListValue): void {
    console.log('====> Select emitChange', value);

    this.transmitValue(value.selectedIDs, {
      addToEventObj: {
        selectedValues: value.selectedValues,
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

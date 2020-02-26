import {
  Component,
  NgZone,
  ChangeDetectorRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { BaseFormElement } from '../../form-elements/base-form-element';
import {
  TreeListOption,
  itemID,
  ViewFilter,
  TreeListComponentIO,
  TreeListKeyMap,
  TreeListValue,
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
import { InputEventType } from '../../form-elements/form-elements.enum';

@Component({
  selector: 'b-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    './tree-select.component.scss',
  ],
})
export class TreeSelectComponent extends BaseFormElement
  implements TreeListComponentIO {
  constructor(zone: NgZone, cd: ChangeDetectorRef) {
    super(cd);
    this.baseValue = [];
    this.wrapEvent = false;
  }

  @ViewChild(TreeListPanelComponent, { static: true })
  listPanel: TreeListPanelComponent;

  @Input() list: TreeListOption[];
  @Input() value: itemID[];
  @Input() valueDefault: itemID[];
  @Input() viewFilter: ViewFilter;
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

  @Input() type: SelectType = SelectType.multi;
  @Input() valueSeparatorChar = '/';
  @Input() maxHeightItems = 8;
  @Input() showSingleGroupHeader = false;
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

  public overlayRef: OverlayRef;
  public panelOpen = false;
  public displayValue: string;
  public displayValueCount: number;
  public positionClassList = {};
  public panelPosition = [BELOW_START, ABOVE_START, BELOW_END, ABOVE_END];
  public panelClass = 'b-tree-select-panel';

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
  }

  public onPanelClose(): void {
    this.overlayRef = null;
    this.panelOpen = false;
  }

  public onApply(): void {}

  public onCancel(): void {}

  public onSelect(value: TreeListValue): void {
    this.emitChange(value);
  }

  private emitChange(value: TreeListValue): void {
    this.transmitValue(value);
  }
}

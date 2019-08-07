import {
  ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnDestroy, Output, ViewContainerRef,
} from '@angular/core';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { ListFooterActions, SelectGroupOption } from '../list.interface';
import { ListChange } from '../list-change/list-change';
import { LIST_EL_HEIGHT } from '../list.consts';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../../popups/panel/panel-position-service/panel-position.service';
import { DOMhelpers } from '../../../services/utils/dom-helpers.service';

@Component({
  selector: 'b-multi-select-panel',
  templateUrl: './multi-select-panel.component.html',
  styleUrls: [
    '../list-panel.scss',
    '../multi-select/multi-select.component.scss',
  ]
})
export class MultiSelectPanelComponent extends BaseSelectPanelElement
  implements OnChanges, OnDestroy {

  @Input() chevronButtonText: string;
  @Input() options: SelectGroupOption[];
  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<ListChange>();

  listChange: ListChange;

  readonly listElHeight = LIST_EL_HEIGHT;
  readonly listActions: ListFooterActions = {
    clear: true,
    apply: true,
    cancel: true
  };
  panelClassList: string[] = ['b-select-panel'];

  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef,
  ) {
    super(overlay, viewContainerRef, panelPositionService, DOM, zone, cd);
  }

  onSelect(listChange: ListChange): void {
    this.listChange = listChange;
  }

  onCancel(): void {
    this.destroyPanel();
  }

  onApply(): void {
    this.options = this.listChange.getSelectGroupOptions();
    this.selectChange.emit(this.listChange);
    this.destroyPanel();
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }
}

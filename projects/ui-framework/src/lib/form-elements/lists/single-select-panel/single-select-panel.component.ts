import {
  ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnDestroy, Output, ViewContainerRef,
} from '@angular/core';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../../popups/panel/panel-position-service/panel-position.service';
import { DOMhelpers } from '../../../services/utils/dom-helpers.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { ListChange } from '../list-change/list-change';
import { SelectGroupOption } from '../list.interface';

@Component({
  selector: 'b-single-select-panel',
  templateUrl: './single-select-panel.component.html',
  styleUrls: [
    '../list-panel.scss',
    '../single-select/single-select.component.scss',
  ],
})
export class SingleSelectPanelComponent extends BaseSelectPanelElement
  implements OnChanges, OnDestroy {

  @Input() chevronButtonText: string;
  @Input() options: SelectGroupOption[];
  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<ListChange>();

  readonly listElHeight = LIST_EL_HEIGHT;
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
    this.options = listChange.getSelectGroupOptions();
    this.selectChange.emit(listChange);
    this.destroyPanel();
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }
}

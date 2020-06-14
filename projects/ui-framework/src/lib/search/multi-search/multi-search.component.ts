import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  NgZone,
} from '@angular/core';
import {
  MultiSearchGroupOption,
  MultiSearchOption,
  MultiSearchClickedEvent,
} from './multi-search.interface';
import { MULTI_SEARCH_KEYMAP_DEF } from './multi-search.const';
import { isFunction } from '../../services/utils/functional-utils';
import { ListPanelService } from '../../lists/list-panel.service';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import { MultiSearchBaseElement } from './multi-search.abstract';

@Component({
  selector: 'b-multi-search',
  templateUrl: './multi-search.component.html',
  styleUrls: ['./multi-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSearchComponent extends MultiSearchBaseElement {
  constructor(
    protected cd: ChangeDetectorRef,
    protected listPanelSrvc: ListPanelService,
    // Used by ListPanelService:
    protected zone: NgZone,
    protected DOM: DOMhelpers,
    protected utilsService: UtilsService,
    protected overlay: Overlay,
    protected viewContainerRef: ViewContainerRef,
    protected panelPositionService: PanelPositionService
  ) {
    super(
      cd,
      listPanelSrvc,
      zone,
      DOM,
      utilsService,
      overlay,
      viewContainerRef,
      panelPositionService
    );
  }

  @Input() options: MultiSearchGroupOption[] = [];

  @Output() clicked: EventEmitter<MultiSearchClickedEvent> = new EventEmitter<
    MultiSearchClickedEvent
  >();

  public onSearchChange(value: string): void {
    this.searchValue = value;
    this.openPanel();
  }

  public onOptionClick(
    group: MultiSearchGroupOption,
    option: MultiSearchOption
  ): void {
    console.log(
      `Clicked: ${
        group[group.keyMap?.groupName || MULTI_SEARCH_KEYMAP_DEF.groupName]
      } - ${option[group.keyMap?.value || MULTI_SEARCH_KEYMAP_DEF.value]}`
    );

    if (isFunction(group.optionClickHandler)) {
      group.optionClickHandler(option);
    }

    if (this.clicked.observers.length) {
      this.clicked.emit({
        group,
        option,
      });
    }
  }
}

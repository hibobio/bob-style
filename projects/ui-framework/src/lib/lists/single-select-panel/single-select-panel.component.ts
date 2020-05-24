import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  ViewContainerRef,
} from '@angular/core';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { ListChange } from '../list-change/list-change';
import { UtilsService } from '../../services/utils/utils.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';
import { SelectType } from '../list.enum';
import { ListPanelService } from '../list-panel.service';
import { MobileService } from '../../services/utils/mobile.service';
import { SINGLE_LIST_LIST_ACTIONS_DEF } from '../list-footer/list-footer.const';

@Component({
  selector: 'b-single-select-panel',
  templateUrl: './single-select-panel.component.html',
  styleUrls: [
    '../list-panel.scss',
    '../single-select/single-select.component.scss',
  ],
})
export class SingleSelectPanelComponent extends BaseSelectPanelElement {
  constructor(
    listChangeSrvc: ListChangeService,
    modelSrvc: ListModelService,
    listPanelSrvc: ListPanelService,
    mobileService: MobileService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef,
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    utilsService: UtilsService
  ) {
    super(
      listChangeSrvc,
      modelSrvc,
      listPanelSrvc,
      mobileService,
      DOM,
      zone,
      cd,
      overlay,
      viewContainerRef,
      panelPositionService,
      utilsService
    );
    this.type = SelectType.single;
    this.wrapEvent = false;
    this.doPropagate = false;
    this.hasArrow = true;
    this.listActions = { ...SINGLE_LIST_LIST_ACTIONS_DEF };
  }

  @Input() chevronButtonText: string;

  onSelect(listChange: ListChange): void {
    this.options = listChange.getSelectGroupOptions();
    this.selectChange.emit(listChange);
    this.destroyPanel();
  }
}

import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  ViewContainerRef,
} from '@angular/core';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { ListChange } from '../list-change/list-change';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';
import { SelectType } from '../list.enum';
import { ListPanelService } from '../list-panel.service';
import { MobileService } from '../../services/utils/mobile.service';
import { LIST_ACTIONS_DEF } from '../list-footer/list-footer.const';

@Component({
  selector: 'b-multi-select-panel',
  templateUrl: './multi-select-panel.component.html',
  styleUrls: [
    '../list-panel.scss',
    '../multi-select/multi-select.component.scss',
  ],
})
export class MultiSelectPanelComponent extends BaseSelectPanelElement {
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
    this.type = SelectType.multi;
    this.wrapEvent = false;
    this.doPropagate = false;
    this.hasArrow = true;
    this.listActions = { ...LIST_ACTIONS_DEF };
  }

  @Input() chevronButtonText: string;
  @Input() max: number;

  onSelect(listChange: ListChange): void {
    this.listChange = listChange;
  }

  onCancel(): void {
    this.listChange = undefined;
    this.destroyPanel();
  }

  onApply(): void {
    if (this.listChange) {
      this.options = this.listChange.getSelectGroupOptions();
      this.selectChange.emit(this.listChange);
      this.listChange = undefined;
    }
    this.destroyPanel();
  }
}

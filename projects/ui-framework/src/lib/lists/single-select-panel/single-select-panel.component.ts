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
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    utilsService: UtilsService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef
  ) {
    super(
      listChangeSrvc,
      modelSrvc,
      overlay,
      viewContainerRef,
      panelPositionService,
      utilsService,
      DOM,
      zone,
      cd
    );

    this.wrapEvent = false;
    this.doPropagate = false;
    this.panelClassList = ['b-select-panel-with-arrow'];
    this.listActions = {
      clear: false,
      apply: false,
      reset: false,
    };
  }

  @Input() chevronButtonText: string;

  onSelect(listChange: ListChange): void {
    this.options = listChange.getSelectGroupOptions();
    this.selectChange.emit(listChange);
    this.destroyPanel();
  }
}

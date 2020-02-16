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
    this.type = SelectType.multi;
    this.wrapEvent = false;
    this.doPropagate = false;
    this.panelClassList = ['b-select-panel-with-arrow'];
    this.listActions = {
      apply: true,
      cancel: true,
      clear: true,
      reset: false,
    };
  }

  @Input() chevronButtonText: string;

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

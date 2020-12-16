import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  ViewContainerRef,
} from '@angular/core';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { ListChange } from '../list-change/list-change';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';
import { SelectType } from '../list.enum';
import { ListPanelService } from '../list-panel.service';
import { MobileService } from '../../services/utils/mobile.service';
import { LIST_ACTIONS_DEF } from '../list-footer/list-footer.const';
import { TranslateService } from '@ngx-translate/core';

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
    protected listChangeSrvc: ListChangeService,
    protected modelSrvc: ListModelService,
    protected listPanelSrvc: ListPanelService,
    protected mobileService: MobileService,
    protected translate: TranslateService,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    public cd: ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef
  ) {
    super(
      listChangeSrvc,
      modelSrvc,
      listPanelSrvc,
      mobileService,
      translate,
      DOM,
      zone,
      cd,
      viewContainerRef
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

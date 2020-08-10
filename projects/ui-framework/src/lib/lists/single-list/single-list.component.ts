import {
  Component,
  Renderer2,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
} from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { ListHeader, ListOption } from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { SelectType } from '../list.enum';
import { MobileService } from '../../services/utils/mobile.service';
import { SINGLE_LIST_LIST_ACTIONS_DEF } from '../list-footer/list-footer.const';

@Component({
  selector: 'b-single-list',
  templateUrl: 'single-list.component.html',
  styleUrls: ['single-list.component.scss'],
})
export class SingleListComponent extends BaseListElement {
  constructor(
    renderer: Renderer2,
    keybrdSrvc: ListKeyboardService,
    modelSrvc: ListModelService,
    listChangeSrvc: ListChangeService,
    mobileService: MobileService,
    cd: ChangeDetectorRef,
    zone: NgZone,
    DOM: DOMhelpers,
    host: ElementRef
  ) {
    super(
      renderer,
      keybrdSrvc,
      modelSrvc,
      listChangeSrvc,
      mobileService,
      cd,
      zone,
      DOM,
      host
    );
    this.type = SelectType.single;
    this.listActions = { ...SINGLE_LIST_LIST_ACTIONS_DEF };
  }

  headerClick(header: ListHeader, index: number): void {
    if (this.options.length > 1 && !header.groupIsOption) {
      this.toggleGroupCollapse(header);
    }

    if (header.groupIsOption && !this.readonly) {
      this.optionClick({
        ...this.options[index].options[0],
        isPlaceHolder: false,
        groupName: header.groupName,
        groupIndex: index,
      } as ListOption);
    }
  }

  getListHeight(): number {
    return (
      (this.listOptions.length +
        (!this.readonly && this.showNoneOption ? 1 : 0)) *
      this.listElHeight
    );
  }
}

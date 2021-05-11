import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  Renderer2,
} from '@angular/core';

import { FORM_ELEMENT_HEIGHT } from '../../form-elements/form-elements.const';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { MobileService } from '../../services/utils/mobile.service';
import { ListChangeService } from '../list-change/list-change.service';
import { BaseListElement } from '../list-element.abstract';
import { SINGLE_LIST_LIST_ACTIONS_DEF } from '../list-footer/list-footer.const';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListModelService } from '../list-service/list-model.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { SelectType } from '../list.enum';
import { ListHeader } from '../list.interface';

@Component({
  selector: 'b-single-list',
  templateUrl: 'single-list.component.html',
  styleUrls: ['single-list.component.scss', 'single-list-extended.scss'],
  providers: [{ provide: BaseListElement, useExisting: SingleListComponent }],
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

  headerClick(header: ListHeader): void {
    if (!header) {
      return;
    }

    if (header.groupIsOption) {
      super.headerClick(header);
      return;
    }

    if (this.options.length > 1 && !header.groupIsOption) {
      this.toggleGroupCollapse(header);
    }
  }

  getListHeight(): number {
    return this.listOptions?.length
      ? (this.listOptions.length +
          (!this.readonly && this.showNoneOption ? 1 : 0)) *
          (FORM_ELEMENT_HEIGHT[this.size] || LIST_EL_HEIGHT)
      : null;
  }
}

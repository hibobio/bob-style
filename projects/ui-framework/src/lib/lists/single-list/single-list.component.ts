import {
  Component,
  Renderer2,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
} from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { ListHeader } from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { SelectType } from '../list.enum';

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
    cd: ChangeDetectorRef,
    zone: NgZone,
    DOM: DOMhelpers,
    host: ElementRef
  ) {
    super(renderer, keybrdSrvc, modelSrvc, listChangeSrvc, cd, zone, DOM, host);
    this.type = SelectType.single;
    this.listActions = {
      apply: false,
      cancel: false,
      clear: false,
      reset: false,
    };
  }

  headerClick(header: ListHeader): void {
    if (this.options.length > 1) {
      this.toggleGroupCollapse(header);
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

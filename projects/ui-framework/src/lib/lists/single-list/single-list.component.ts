import {
  Component,
  Input,
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
    this.listActions = {
      clear: false,
      apply: false,
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
      (this.listOptions.length + (this.showNoneOption ? 1 : 0)) *
      this.listElHeight
    );
  }
}

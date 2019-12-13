import {
  Component,
  Renderer2,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
} from '@angular/core';
import { ListModelService } from '../list-service/list-model.service';
import { chain } from 'lodash';
import { ListHeader } from '../list.interface';
import { BaseListElement } from '../list-element.abstract';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@Component({
  selector: 'b-multi-list',
  templateUrl: 'multi-list.component.html',
  styleUrls: [
    '../single-list/single-list.component.scss',
    'multi-list.component.scss',
  ],
})
export class MultiListComponent extends BaseListElement {
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
      clear: true,
      reset: false,
      apply: false,
    };
  }

  headerClick(header: ListHeader): void {
    if (this.options.length > 1) {
      this.toggleGroupCollapse(header);
    } else {
      this.selectGroup(header);
    }
  }

  selectGroup(header: ListHeader): void {
    header.selected = this.getHeaderSelect(header);

    const groupOptionsIds = chain(this.options)
      .filter(group => this.isSameGroup(header, group))
      .flatMap('options')
      .filter(option => !option.disabled)
      .flatMap('id')
      .value();

    this.selectedIDs = header.selected
      ? chain(this.selectedIDs)
          .concat(groupOptionsIds)
          .concat(this.getSelectedIDs(this.options, 'disabled'))
          .uniq()
          .value()
      : chain(this.selectedIDs)
          .difference(groupOptionsIds)
          .concat(this.getSelectedIDs(this.options, 'disabled'))
          .uniq()
          .value();

    this.emitChange();
    this.updateActionButtonsState();

    this.updateLists({
      updateListHeaders: false,
      updateListOptions: false,
      selectedIDs: this.selectedIDs,
    });
  }

  private getHeaderSelect(header: ListHeader): boolean {
    const options = chain(this.options)
      .filter(group => this.isSameGroup(header, group))
      .flatMap('options')
      .filter(o => !(o.disabled && !o.selected))
      .value();
    return !options.every(o => o.selected);
  }
}

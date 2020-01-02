import {
  Component,
  forwardRef,
  ViewContainerRef,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import {
  BELOW_START,
  ABOVE_START,
  ABOVE_END,
  BELOW_END,
} from '../../popups/panel/panel-position-service/panel-position.const';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { isArray, arrayFlatten } from '../../services/utils/functional-utils';
import { ListModelService } from '../list-service/list-model.service';
import { SelectOption } from '../list.interface';

@Component({
  selector: 'b-single-select',
  templateUrl: 'single-select.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    'single-select.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: SingleSelectComponent },
  ],
})
export class SingleSelectComponent extends BaseSelectPanelElement {
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
    this.value = null;
    this.panelPosition = [BELOW_START, ABOVE_START, BELOW_END, ABOVE_END];
    this.listActions = {
      clear: false,
      apply: false,
      reset: false,
    };
  }

  onSelect(listChange: ListChange) {
    this.value = listChange.getSelectedIds();
    this.displayValue = this.getDisplayValue(this.value) || null;
    this.emitChange(listChange);
    this.destroyPanel();
  }

  protected setDisplayValue(): void {
    this.displayValue = this.getDisplayValue(this.value) || null;
  }

  private getDisplayValue(selectedIDs: (string | number)[]): string {
    const option =
      selectedIDs &&
      this.options &&
      arrayFlatten(this.options.map(group => group.options)).find(
        (opt: SelectOption) => selectedIDs.includes(opt.id)
      );
    return option && option.value;
  }

  private emitChange(listChange: ListChange): void {
    this.options = listChange.getSelectGroupOptions();

    this.selectChange.emit(listChange);

    if (this.changed.observers.length > 0) {
      this.changed.emit(
        (isArray(this.value) ? this.value[0] : this.value) || null
      );
    }
    if (this.doPropagate) {
      this.propagateChange(
        (isArray(this.value) ? this.value[0] : this.value) || null
      );
      this.onTouched();
    }
  }
}

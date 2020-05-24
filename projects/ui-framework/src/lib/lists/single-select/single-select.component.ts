import {
  Component,
  forwardRef,
  ViewContainerRef,
  NgZone,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { isArray, arrayFlatten } from '../../services/utils/functional-utils';
import { ListModelService } from '../list-service/list-model.service';
import { SelectOption } from '../list.interface';
import { SelectType } from '../list.enum';
import { FormEvents } from '../../form-elements/form-elements.enum';
import { ListPanelService } from '../list-panel.service';
import { MobileService } from '../../services/utils/mobile.service';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';
import { SINGLE_LIST_LIST_ACTIONS_DEF } from '../list-footer/list-footer.const';

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
    this.type = SelectType.single;
    this.value = null;
    this.hasArrow = false;
    this.panelPosition = PanelDefaultPosVer.belowLeftRight;
    this.listActions = { ...SINGLE_LIST_LIST_ACTIONS_DEF };
  }

  @Input() showNoneOption = true;

  protected getDisplayValue(): string {
    const option =
      this.value &&
      this.options &&
      arrayFlatten(
        this.options.map((group) => group.options)
      ).find((opt: SelectOption) => this.value.includes(opt.id));
    return option && option.value;
  }

  protected emitChange(
    event: FormEvents = FormEvents.selectChange,
    listChange: ListChange = this.listChange
  ): void {
    this.dirty = true;
    this.options = listChange.getSelectGroupOptions();

    if (this[event].observers.length > 0) {
      this[event].emit(listChange);
    }

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

    this.destroyPanel();
  }
}

import {
  Component,
  EventEmitter,
  forwardRef,
  Output,
  ViewContainerRef,
  ViewChild,
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
import { ListModelService } from '../list-service/list-model.service';
import { SelectOption } from '../list.interface';
import { TruncateTooltipComponent } from '../../popups/truncate-tooltip/truncate-tooltip.component';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { UtilsService } from '../../services/utils/utils.service';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { FormEvents } from '../../form-elements/form-elements.enum';
import { arrayFlatten } from '../../services/utils/functional-utils';
import { SelectType } from '../list.enum';
import { ListPanelService } from '../list-panel.service';
import { MobileService } from '../../services/utils/mobile.service';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';
import { LIST_ACTIONS_DEF } from '../list-footer/list-footer.const';

@Component({
  selector: 'b-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: [
    '../../form-elements/input/input.component.scss',
    '../single-select/single-select.component.scss',
    'multi-select.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: MultiSelectComponent },
  ],
})
export class MultiSelectComponent extends BaseSelectPanelElement {
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
    this.type = SelectType.multi;
    this.hasArrow = false;
    this.panelPosition = PanelDefaultPosVer.belowLeftRight;
    this.listActions = { ...LIST_ACTIONS_DEF };
  }

  @ViewChild('input', { static: true, read: TruncateTooltipComponent })
  truncate: TruncateTooltipComponent;

  @Input() max: number;

  @Output() selectModified: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();
  @Output() selectCancelled: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  onApply(): void {
    if (this.listChange) {
      this.dirty = true;
      this.emitChange(FormEvents.selectChange);
      this.listChange = undefined;
    }
    this.destroyPanel();
  }

  onCancel(): void {
    if (this.listChange) {
      this.value = this.modelSrvc.getSelectedIDs(this.options);
      this.setDisplayValue();
      this.emitChange(
        FormEvents.selectCancelled,
        this.listChangeSrvc.getListChange(this.options, this.value)
      );
      this.listChange = undefined;
    }
    this.destroyPanel();
  }

  protected getDisplayValue(): string {
    return (
      this.value &&
      this.options &&
      arrayFlatten(this.options.map((group) => group.options))
        .filter((option: SelectOption) => this.value.includes(option.id))
        .map((option: SelectOption) => option.value)
        .join(', ')
    );
  }

  protected emitChange(
    event: FormEvents,
    listChange: ListChange = this.listChange
  ): void {
    if (this[event].observers.length > 0) {
      this[event].emit(listChange);
    }

    if (event === FormEvents.selectChange) {
      this.options = listChange.getSelectGroupOptions();

      if (this.changed.observers.length > 0) {
        this.changed.emit(this.value);
      }

      if (this.doPropagate) {
        this.propagateChange(this.value);
        this.onTouched();
      }
    }
  }
}

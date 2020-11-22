import {
  Component,
  EventEmitter,
  forwardRef,
  Output,
  ViewContainerRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
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
import { TranslateService } from '@ngx-translate/core';
import { IconColor, Icons } from '../../icons/icons.enum';
import { ShowcaseInputItem } from '../../avatar/employees-showcase/employees-showcase.interface';
import { Avatar } from '../../avatar/avatar/avatar.interface';

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
    protected listChangeSrvc: ListChangeService,
    protected modelSrvc: ListModelService,
    protected listPanelSrvc: ListPanelService,
    protected mobileService: MobileService,
    protected translate: TranslateService,
    protected DOM: DOMhelpers,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected overlay: Overlay,
    protected viewContainerRef: ViewContainerRef,
    protected panelPositionService: PanelPositionService,
    protected utilsService: UtilsService
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

  @Output() selectModified: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();
  @Output() selectCancelled: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  public valueShowcase: ShowcaseInputItem[];

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
    const options =
      this.value &&
      this.options &&
      arrayFlatten<SelectOption>(
        this.options.map((group) => group.options)
      ).filter((option) => this.value.includes(option.id));

    this.valueShowcase =
      this.showValueShowcase !== false && this.getValueShowcase(options);

    return options?.map((option: SelectOption) => option.value).join(', ');
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

  private getValueShowcase(options: SelectOption[]): Avatar[] {
    return options?.filter((o) => o.prefixComponent).length
      ? options.map((option) =>
          this.modelSrvc.getOptionAvatar(
            option,
            this.size,
            options.length > 1 ? null : 'transparent'
          )
        )
      : this.defaultIcon
      ? [
          {
            id: 'no-value',
            imageSource: null,
            icon: this.modelSrvc.getOptionIcon(
              { icon: this.defaultIcon },
              this.size,
              IconColor.normal
            ),
            backgroundColor: 'transparent',
          } as Avatar,
        ]
      : undefined;
  }
}

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  NgZone,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ShowcaseInputItem } from '../../avatar/avatar-showcase/avatar-showcase.interface';
import { Avatar } from '../../avatar/avatar/avatar.interface';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { FormEvents } from '../../form-elements/form-elements.enum';
import { IconColor } from '../../icons/icons.enum';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';
import { TruncateTooltipComponent } from '../../popups/truncate-tooltip/truncate-tooltip.component';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { arrayFlatten } from '../../services/utils/functional-utils';
import { MobileService } from '../../services/utils/mobile.service';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';
import { LIST_ACTIONS_DEF } from '../list-footer/list-footer.const';
import { ListPanelService } from '../list-panel.service';
import { ListModelService } from '../list-service/list-model.service';
import { SelectType } from '../list.enum';
import { SelectOption } from '../list.interface';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';

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
    this.hasArrow = false;
    this.panelPosition = PanelDefaultPosVer.belowLeftRight;
    this.listActions = { ...LIST_ACTIONS_DEF };

    this.showValueShowcase = false;
  }

  @ViewChild('input', { static: true, read: TruncateTooltipComponent })
  truncate: TruncateTooltipComponent;

  @Output() selectModified: EventEmitter<ListChange> = new EventEmitter();
  @Output() selectCancelled: EventEmitter<ListChange> = new EventEmitter();

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

import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  NgZone,
  OnChanges,
  ViewContainerRef,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { Avatar } from '../../avatar/avatar/avatar.interface';
import { BaseFormElement } from '../../form-elements/base-form-element';
import {
  FormElementSize,
  FormEvents,
} from '../../form-elements/form-elements.enum';
import { IconColor } from '../../icons/icons.enum';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { arrayFlatten, isArray } from '../../services/utils/functional-utils';
import { MobileService } from '../../services/utils/mobile.service';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';
import { SINGLE_LIST_LIST_ACTIONS_DEF } from '../list-footer/list-footer.const';
import { ListPanelService } from '../list-panel.service';
import { ListModelService } from '../list-service/list-model.service';
import { SelectType } from '../list.enum';
import { SelectOption } from '../list.interface';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';

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
export class SingleSelectComponent
  extends BaseSelectPanelElement
  implements OnChanges {
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
    this.type = SelectType.single;
    this.value = null;
    this.hasArrow = false;
    this.panelPosition = PanelDefaultPosVer.belowLeftRight;
    this.listActions = { ...SINGLE_LIST_LIST_ACTIONS_DEF };
  }

  @Input() showNoneOption = true;
  @Input() ghost = false;

  public valueAvatar: Avatar;

  readonly avatarSize = AvatarSize;
  readonly formElementSize = FormElementSize;

  protected getDisplayValue(): string {
    const option: SelectOption =
      this.value &&
      this.options &&
      arrayFlatten<SelectOption>(
        this.options.map((group) => group.options)
      ).find((opt) => this.value.includes(opt.id));

    this.valueAvatar =
      this.showValueShowcase !== false && this.getValueAvatar(option);

    return option?.value;
  }

  ngOnChanges(changes) {
    if (changes.ghost) {
      this.panelClassList = this.panelClassList.filter(
        (className) => className !== 'panel-ghost'
      );
      this.ghost && this.panelClassList.push('panel-ghost');
    }
    super.ngOnChanges(changes);
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

  private getValueAvatar(option: SelectOption): Avatar {
    const size = this.ghost ? FormElementSize.smaller : this.size;

    return option
      ? this.modelSrvc.getOptionAvatar(option, size, 'transparent')
      : this.defaultIcon
      ? ({
          id: 'no-value',
          imageSource: null,
          icon: this.modelSrvc.getOptionIcon(
            { icon: this.defaultIcon },
            size,
            IconColor.normal
          ),
          backgroundColor: 'transparent',
        } as Avatar)
      : undefined;
  }
}

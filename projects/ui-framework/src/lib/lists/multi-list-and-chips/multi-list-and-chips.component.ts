import { get } from 'lodash';
import { filter, map } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ChipListComponent } from '../../chips/chip-list/chip-list.component';
import { ChipType } from '../../chips/chips.enum';
import { ChipListConfig } from '../../chips/chips.interface';
import { ListChangeService } from '../../lists/list-change/list-change.service';
import { ListModelService } from '../../lists/list-service/list-model.service';
import {
  itemID,
  SelectGroupOption,
  SelectOption,
} from '../../lists/list.interface';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  isArray,
  isNotEmptyArray,
} from '../../services/utils/functional-utils';
import { MultiListComponent } from '../multi-list/multi-list.component';
import { MlacChip } from './multi-list-and-chips.interface';
import { BaseMultiListAndSomethingElement } from './multi-list-and-something.abstract';
import { MultiListAndSomething } from './multi-list-and-something.interface';

@Component({
  selector: 'b-multi-list-and-chips',
  templateUrl: './multi-list-and-chips.component.html',
  styleUrls: [
    './multi-list-and-something.scss',
    './multi-list-and-chips.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiListAndChipsComponent
  extends BaseMultiListAndSomethingElement<MlacChip, MultiListComponent>
  implements MultiListAndSomething<MlacChip, MultiListComponent>, OnInit {
  constructor(
    public host: ElementRef<HTMLElement>,
    protected DOM: DOMhelpers,
    protected translate: TranslateService,
    protected listModelService: ListModelService,
    protected listChangeService: ListChangeService,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef
  ) {
    super(host, DOM, translate, listModelService, listChangeService, zone, cd);
  }

  @ViewChild(ChipListComponent, { static: true }) chipList: ChipListComponent;

  @Input('chipsLabel') otherLabel: string;

  // for compatibility
  public get chipsLabel(): string {
    return this.otherLabel;
  }
  public set chipsLabel(label: string) {
    this.otherLabel = label;
  }

  public chipListConfig: ChipListConfig = {
    type: ChipType.tag,
    selectable: false,
    focusable: true,
    removable: true,
  };

  ngOnInit(): void {
    super.ngOnInit();

    this.subs.push(
      this.inputOptions$
        .pipe(
          filter((options) => isNotEmptyArray(options)),
          map((options) => this.detectChipType(options)),
          filter((type) => type !== this.chipListConfig.type)
        )
        .subscribe((type) => {
          this.chipListConfig = {
            ...this.chipListConfig,
            type,
          };

          if (!this.cd['destroyed']) {
            this.cd.detectChanges();
          }
        })
    );

    this.DOM.setCssProps(this.host.nativeElement, {
      '--translation-all': `'(${this.translate.instant('common.all')})'`,
    });
  }

  // method used by base class to map list options to other list
  public optionsToOtherList(
    options: SelectGroupOption[],
    value: itemID[]
  ): MlacChip[] {
    const chips: MlacChip[] = [];

    const isSelected = (option: SelectOption) =>
      isArray(value) ? value.includes(option.id) : option.selected;

    options.forEach((group: SelectGroupOption, index) => {
      if (
        group.options.every((option: SelectOption) => isSelected(option)) &&
        (this.chipListConfig.type !== ChipType.avatar ||
          group.options.length === 1)
      ) {
        chips.push({
          text: group.groupName,
          group: {
            index,
            key: this.listModelService.getGroupKey(group),
            name: group.groupName,
          },
          type:
            group.options.length === 1
              ? this.getChipTypeFromOption(group.options[0])
              : undefined,
          class: group.options.length === 1 ? 'group-is-option' : 'all-group',
        });
      } else {
        group.options.forEach((option: SelectOption) => {
          if (isSelected(option)) {
            chips.push({
              text: option.value,
              id: option.id,
              imageSource: get(
                option,
                'prefixComponent.attributes.imageSource',
                undefined
              ),
              icon: get(option, 'prefixComponent.attributes.icon', undefined),
              type: this.getChipTypeFromOption(option),
              removable: !option.disabled,
            });
          }
        });
      }
    });

    return chips;
  }

  public unselectOptions(chip: MlacChip): void {
    super.unselectOptions(
      chip.group
        ? this.listOptions$
            .getValue()
            [chip.group.index].options.filter((o) => !o.disabled)
            .map((o) => o.id)
        : chip.id
    );
  }

  private detectChipType(options: SelectGroupOption[]): ChipType {
    return Boolean(
      options?.find(
        (g) => this.getChipTypeFromOption(g.options[0]) !== ChipType.tag
      )
    )
      ? ChipType.avatar
      : ChipType.tag;
  }

  private getChipTypeFromOption(option: SelectOption): ChipType {
    return get(option, 'prefixComponent.attributes.imageSource', false)
      ? ChipType.avatar
      : get(option, 'prefixComponent.attributes.icon', false)
      ? ChipType.icon
      : ChipType.tag;
  }
}

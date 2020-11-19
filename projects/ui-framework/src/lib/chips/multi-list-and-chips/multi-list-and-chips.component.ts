import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  itemID,
  SelectGroupOption,
  SelectOption,
} from '../../lists/list.interface';
import { ChipListConfig } from '../chips.interface';
import { ChipType } from '../chips.enum';
import {
  isArray,
  isNotEmptyArray,
} from '../../services/utils/functional-utils';
import { get } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { ChipListComponent } from '../chip-list/chip-list.component';
import { ListChangeService } from '../../lists/list-change/list-change.service';
import { BaseMultiListAndSomethingElement } from './multi-list-and-something.abstract';
import { MultiListAndSomething } from './multi-list-and-something.interface';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { filter, map } from 'rxjs/operators';
import { MlacChip } from './multi-list-and-chips.interface';

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
  extends BaseMultiListAndSomethingElement<MlacChip>
  implements MultiListAndSomething<MlacChip>, OnInit {
  constructor(
    public host: ElementRef,
    protected translate: TranslateService,
    protected listModelService: ListModelService,
    protected listChangeService: ListChangeService,
    private DOM: DOMhelpers,
    private cd: ChangeDetectorRef
  ) {
    super(translate, listModelService, listChangeService);
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
          filter(isNotEmptyArray),
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
        this.chipListConfig.type !== ChipType.avatar &&
        group.options.every((option: SelectOption) => isSelected(option))
      ) {
        chips.push({
          text: group.groupName,
          group: {
            index,
            key: this.listModelService.getGroupKey(group),
            name: group.groupName,
          },
          class: 'all-group',
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
            [chip.group.index].options.map((o) => o.id)
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

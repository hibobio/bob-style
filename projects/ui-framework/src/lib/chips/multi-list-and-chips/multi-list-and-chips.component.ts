import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { LIST_EL_HEIGHT } from '../../lists/list.consts';
import { SelectGroupOption, SelectOption } from '../../lists/list.interface';
import { ChipListConfig, Chip } from '../chips.interface';
import { ChipType } from '../chips.enum';
import { ListChange } from '../../lists/list-change/list-change';
import {
  simpleUID,
  cloneArray,
  isNotEmptyArray,
  applyChanges,
  hasChanges,
} from '../../services/utils/functional-utils';
import { EmptyStateConfig } from '../../indicators/empty-state/empty-state.interface';
import { get } from 'lodash';

@Component({
  selector: 'b-multi-list-and-chips',
  templateUrl: './multi-list-and-chips.component.html',
  styleUrls: ['./multi-list-and-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiListAndChipsComponent implements OnChanges {
  constructor(private cd: ChangeDetectorRef) {}

  @Input() options: SelectGroupOption[] = [];
  @Input() listLabel: string;
  @Input() chipsLabel: string;
  @Input() showSingleGroupHeader = false;
  @Input() emptyState: EmptyStateConfig;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  public listOptions: SelectGroupOption[] = [];
  public chips: Chip[] = [];

  readonly listElHeight: number = LIST_EL_HEIGHT;
  public chipListConfig: ChipListConfig = {
    type: ChipType.tag,
    selectable: false,
    focusable: true,
    removable: true,
  };
  readonly listID: string = simpleUID('mlacl-');
  readonly chipListID: string = simpleUID('mlacc-');

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(
      this,
      changes,
      {
        options: [],
      },
      [],
      true
    );

    if (hasChanges(changes, ['options'])) {
      this.options = this.listOptions =
        this.options?.filter((group: SelectGroupOption) =>
          isNotEmptyArray(group.options)
        ) || [];
      this.chipListConfig.type = this.detectChipType(this.options);
      this.optionsToChips(this.options);
      this.cd.detectChanges();
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public detectChipType(options: SelectGroupOption[] = this.options): ChipType {
    return get(
      options,
      '[0].options[0].prefixComponent.attributes.imageSource',
      false
    )
      ? ChipType.avatar
      : ChipType.tag;
  }

  public onListChange(listChange: ListChange): void {
    this.options = listChange.getSelectGroupOptions();
    this.optionsToChips(this.options);
    this.emitChange();
  }

  public onChipRemoved(chip: Chip) {
    this.listOptions = this.removeChipAndOption(chip);
    this.emitChange();
  }

  private optionsToChips(options: SelectGroupOption[] = this.options): Chip[] {
    const chips = [];

    options.forEach((group: SelectGroupOption) => {
      if (
        this.chipListConfig.type !== ChipType.avatar &&
        group.options.every((option: SelectOption) => option.selected)
      ) {
        chips.push({
          text: group.groupName,
          group: {
            key: group.key,
            name: group.groupName,
          },
          class: 'all-group',
        });
      } else {
        group.options.forEach((option: SelectOption) => {
          if (option.selected) {
            chips.push({
              text: option.value,
              id: option.id,
              imageSource:
                this.chipListConfig.type === ChipType.avatar &&
                option.prefixComponent.attributes.imageSource,
              type: this.chipListConfig.type,
              removable: !option.disabled,
            });
          }
        });
      }
    });

    this.chips = chips;
    return this.chips;
  }

  private removeChipAndOption(chip: Chip) {
    const options: SelectGroupOption[] = cloneArray(this.options);

    if ((chip as any).group) {
      const group = options.find(
        (g: SelectGroupOption) =>
          (g.key && g.key === (chip as any).group.key) ||
          g.groupName === (chip as any).group.name
      );

      group.options.forEach((option: SelectOption) => {
        if (!option.disabled) {
          option.selected = false;
        }
      });

      // this.chips = this.optionsToChips(options);
      this.optionsToChips(options);
    } else {
      options.find((group: SelectGroupOption) => {
        const opt = group.options.find((o: SelectOption) => o.id === chip.id);
        if (opt) {
          opt.selected = false;
          return true;
        }
        return false;
      });

      this.chips = this.chips.filter((ch: any) => ch.id !== chip.id);
    }

    return (this.options = options);
  }

  private emitChange(): void {
    this.selectChange.emit(new ListChange(this.options));
  }
}

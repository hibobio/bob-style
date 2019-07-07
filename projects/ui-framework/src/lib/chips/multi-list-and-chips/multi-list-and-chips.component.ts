import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { LIST_EL_HEIGHT } from '../../form-elements/lists/list.consts';
import {
  SelectGroupOption,
  SelectOption
} from '../../form-elements/lists/list.interface';
import { ChipListConfig, Chip } from '../chips.interface';
import { ChipType } from '../chips.enum';
import { ListChange } from '../../form-elements/lists/list-change/list-change';
import { simpleUID } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-multi-list-and-chips',
  templateUrl: './multi-list-and-chips.component.html',
  styleUrls: ['./multi-list-and-chips.component.scss']
})
export class MultiListAndChipsComponent implements OnChanges {
  constructor(private host: ElementRef) {}

  @Input() options: SelectGroupOption[] = [];
  @Input() listLabel: string;
  @Input() chipsLabel: string;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  public listOptions: SelectGroupOption[] = [];
  public chips: Chip[] = [];

  readonly listElHeight: number = LIST_EL_HEIGHT;
  readonly chipListConfig: ChipListConfig = {
    type: ChipType.tag,
    selectable: false,
    focusable: true,
    removable: true
  };
  readonly listID: string = simpleUID('mlacl-');
  readonly chipListID: string = simpleUID('mlacc-');

  public onListChange(listChange: ListChange): void {
    this.options = listChange.getSelectGroupOptions();
    this.optionsToChips(this.options);
    this.selectChange.emit(new ListChange(this.options));
  }

  public onChipRemoved(chip: Chip) {
    this.listOptions = this.removeChipAndOption(chip);
    this.selectChange.emit(new ListChange(this.options));
  }

  private optionsToChips(options: SelectGroupOption[] = this.options): Chip[] {
    const chips = [];

    options.forEach((group: SelectGroupOption) => {
      if (group.options.every((option: SelectOption) => option.selected)) {
        chips.push({
          text: group.groupName + ' (all)',
          group: {
            key: group.key,
            name: group.groupName
          },
          type: this.chipListConfig.type !== ChipType.avatar && ChipType.info
        });
      } else {
        group.options.forEach((option: SelectOption) => {
          if (option.selected) {
            chips.push({
              text: option.value,
              id: option.id
            });
          }
        });
      }
    });

    return (this.chips = chips);
  }

  private removeChipAndOption(chip: Chip) {
    const options: SelectGroupOption[] = this.options.slice();

    if ((chip as any).group) {
      const group = options.find(
        (g: SelectGroupOption) =>
          (g.key && g.key === (chip as any).group.key) ||
          g.groupName === (chip as any).group.name
      );

      group.options.forEach((option: SelectOption) => {
        option.selected = false;
      });

      this.chips = this.chips.filter(
        (ch: any) =>
          !ch.group ||
          ((ch.group &&
            ch.group.key &&
            ch.group.key !== (chip as any).group.key) ||
            (ch.group && ch.group.name !== (chip as any).group.name))
      );
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      this.options = this.listOptions = changes.options.currentValue;
      this.optionsToChips(this.options);

      setTimeout(() => {
        this.host.nativeElement.style.height =
          this.host.nativeElement.offsetHeight > 200
            ? this.host.nativeElement.offsetHeight + 'px'
            : null;
      }, 0);
    }
  }
}

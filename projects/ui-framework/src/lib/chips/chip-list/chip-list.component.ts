import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ViewChildren,
  QueryList,
  HostListener,
  ChangeDetectionStrategy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { Chip, ChipListConfig, ChipKeydownEvent } from '../chips.interface';
import {
  isKey,
  isNumber,
  hasChanges,
  applyChanges,
} from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { ChipComponent } from '../chip/chip.component';
import { arrayOfValuesToArrayOfObjects } from '../../services/utils/transformers';
import { ChipType, ChipListAlign, ChipListSelectable } from '../chips.enum';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { IconSize } from '../../icons/icons.enum';

@Component({
  selector: 'b-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipListComponent implements OnChanges {
  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}

  @ViewChildren('list') public list: QueryList<ChipComponent>;

  @HostBinding('class.empty') get isEmpty() {
    return !this.chips || !this.chips.length;
  }

  @Input() chipListSelectable: ChipListSelectable = ChipListSelectable.multi;

  @Input() activeIndex: number;

  @Input() chips: Chip[] = [];
  @Input() config: ChipListConfig = {};

  readonly chipType = ChipType;
  readonly avatarSize = AvatarSize;
  readonly iconSize = IconSize;

  @Output() removed: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() selected: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() clicked: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() keyPressed: EventEmitter<ChipKeydownEvent> = new EventEmitter<
    ChipKeydownEvent
  >();

  @HostBinding('attr.role') role = 'list';
  @HostBinding('attr.data-align')
  get alignChips() {
    return this.config.align || ChipListAlign.left;
  }
  @HostBinding('attr.data-type')
  get chipsType() {
    return this.config.type || ChipType.tag;
  }

  @HostListener('click.outside-zone', ['$event'])
  onHostClick($event: MouseEvent) {
    const target = $event.target as HTMLElement;

    if (!this.config.disabled && target.nodeName.toUpperCase() === 'B-CHIP') {
      const index = parseInt(target.dataset.index, 10);
      const chip = this.chips[index];

      if (!chip.disabled && chip.removable !== false) {
        this.zone.run(() => {
          this.onChipClick($event, chip, index);
        });
      }
    }
  }

  @HostListener('keydown.outside-zone', ['$event'])
  onHostKeydown($event: KeyboardEvent) {
    const target = $event.target as HTMLElement;
    if (!this.config.disabled && target.nodeName.toUpperCase() === 'B-CHIP') {
      const index = parseInt(target.dataset.index, 10);
      const chip = this.chips[index];

      if (!chip.disabled && chip.removable !== false) {
        this.zone.run(() => {
          this.onChipKeydown($event, chip, index);
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        config: {},
        chipListSelectable: ChipListSelectable.multi,
      },
      ['chips']
    );

    if (hasChanges(changes, ['chips'], true)) {
      this.chips = arrayOfValuesToArrayOfObjects('text')(
        changes.chips.currentValue
      );
    }

    if (hasChanges(changes, ['config'], true)) {
      this.config.selectable = this.isTypeTabs()
        ? ChipListSelectable.single
        : this.config.selectable;

      this.config.focusable = this.isTypeTabs() ? true : this.config.focusable;

      this.chipListSelectable =
        this.config.selectable !== ChipListSelectable.single &&
        !this.isTypeTabs()
          ? ChipListSelectable.multi
          : ChipListSelectable.single;
    }

    if (
      hasChanges(changes, ['chipListSelectable'], true) &&
      this.chipListSelectable !== changes.chipListSelectable.currentValue
    ) {
      this.chipListSelectable = changes.chipListSelectable.currentValue;
    }

    if (
      changes.activeIndex &&
      isNumber(this.activeIndex) &&
      this.chipListSelectable === ChipListSelectable.single &&
      this.chips[this.activeIndex]
    ) {
      this.selectChip(this.chips[this.activeIndex], this.activeIndex);
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  onChipRemove(chip: Chip): void {
    if (this.removed.observers) {
      this.removed.emit(chip);
    }
  }

  onChipClick(event: MouseEvent, chip: Chip, index: number): void {
    event.stopPropagation();
    if (this.config.selectable) {
      this.selectChip(chip, index);
    }
    if (this.clicked.observers) {
      this.clicked.emit(chip);
    }
  }

  onChipKeydown(event: KeyboardEvent, chip: Chip, index: number): void {
    if (this.keyPressed.observers) {
      this.keyPressed.emit({ event, chip });
    }

    if (this.config.focusable) {
      if (isKey(event.key, Keys.arrowleft) || isKey(event.key, Keys.arrowup)) {
        event.stopPropagation();
        this.focusChipElByIndex(index - 1);
      }
      if (
        isKey(event.key, Keys.arrowright) ||
        isKey(event.key, Keys.arrowdown)
      ) {
        event.stopPropagation();
        this.focusChipElByIndex(index + 1);
      }
    }

    if (
      this.config.selectable &&
      (isKey(event.key, Keys.space) || isKey(event.key, Keys.enter))
    ) {
      event.stopPropagation();
      this.selectChip(chip, index);
    }

    if (
      this.config.removable &&
      chip.removable !== false &&
      (isKey(event.key, Keys.backspace) || isKey(event.key, Keys.delete))
    ) {
      event.stopPropagation();
      this.onChipRemove(chip);

      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.focusChipElByIndex(
            isKey(event.key, Keys.backspace) ? index - 1 : index
          );
        }, 0);
      });
    }
  }

  private selectChip(chip: Chip, index): void {
    const isSelected = chip.selected;

    if (this.chipListSelectable === ChipListSelectable.single) {
      if (!isSelected) {
        this.deselectAllChips();
        chip.selected = true;
      }
    } else {
      chip.selected = !isSelected;
    }
    if (chip.selected !== isSelected && this.selected.observers) {
      this.selected.emit(chip);
    }
  }

  private deselectAllChips(): void {
    this.chips.forEach(chip => {
      chip.selected = false;
    });
  }

  private focusChipElByIndex(index: number): void {
    const chipComp = this.list.toArray()[index];
    if (chipComp) {
      chipComp.chip.focus();
    }
  }

  public chipsTrackBy(index: number, chip: Chip): string | number {
    return chip.id || chip.text || JSON.stringify(chip);
  }

  private isTypeTabs() {
    return (
      this.config.type === ChipType.tab || this.config.type === ChipType.button
    );
  }
}

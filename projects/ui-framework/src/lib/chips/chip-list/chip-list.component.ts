import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ViewChildren,
  QueryList
} from '@angular/core';
import { Chip, ChipListConfig, ChipKeydownEvent } from '../chips.interface';
import { isKey } from '../../services/utils/functional-utils';
import { Keys } from '../../enums';
import { ChipComponent } from '../chip/chip.component';
import { arrayOfValuesToArrayOfObjects } from '../../services/utils/transformers';
import { ChipType, ChipListAlign } from '../chips.enum';
import { AvatarSize } from '../../buttons-indicators/avatar/avatar.enum';

@Component({
  selector: 'b-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss']
})
export class ChipListComponent implements OnChanges {
  constructor() {}

  @ViewChildren('list') public list: QueryList<ChipComponent>;

  @Input() chips: Chip[] = [];
  @Input() config: ChipListConfig = {};

  readonly chipType = ChipType;
  readonly avatarSize = AvatarSize;

  @Output() removed: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() selected: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() clicked: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() keyPressed: EventEmitter<ChipKeydownEvent> = new EventEmitter<
    ChipKeydownEvent
  >();

  @HostBinding('attr.role') role = 'list';
  @HostBinding('attr.data-align') alignChips = ChipListAlign.left;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chips) {
      this.chips = arrayOfValuesToArrayOfObjects('text')(
        changes.chips.currentValue
      );
    }
    if (changes.config) {
      this.alignChips = changes.config.currentValue.align
        ? changes.config.currentValue.align
        : this.alignChips;
    }
  }

  onChipRemove(chip: Chip): void {
    this.removed.emit(chip);
  }

  onChipClick(event: MouseEvent, chip: Chip): void {
    event.stopPropagation();
    if (this.config.selectable) {
      this.selectChip(chip);
    }
    this.clicked.emit(chip);
  }

  onChipKeydown(event: KeyboardEvent, chip: Chip, index: number): void {
    this.keyPressed.emit({ event, chip });

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
      this.selectChip(chip);
    }

    if (
      this.config.removable &&
      (isKey(event.key, Keys.backspace) || isKey(event.key, Keys.delete))
    ) {
      event.stopPropagation();
      this.onChipRemove(chip);

      setTimeout(() => {
        this.focusChipElByIndex(
          isKey(event.key, Keys.backspace) ? index - 1 : index
        );
      }, 0);
    }
  }

  private selectChip(chip: Chip): void {
    chip.selected = !chip.selected;
    this.selected.emit(chip);
  }

  private focusChipElByIndex(index: number): void {
    const chipComp = this.list.toArray()[index];
    if (chipComp) {
      chipComp.chip.nativeElement.focus();
    }
  }
}

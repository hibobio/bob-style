import {
  ChangeDetectorRef,
  Directive,
  HostBinding,
  HostListener,
  NgZone,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { Keys } from '../../enums';
import { isKey } from '../../services/utils/functional-utils';
import { DOMKeyboardEvent, DOMMouseEvent } from '../../types';
import { ChipComponent } from '../chip/chip.component';
import { ChipListAlign, ChipListSelectable, ChipType } from '../chips.enum';
import { Chip, ChipListConfig } from '../chips.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class ChipListBaseElement {
  constructor(protected zone: NgZone, protected cd: ChangeDetectorRef) {}

  @ViewChildren('list') public list: QueryList<ChipComponent>;

  public chips: (Chip | any)[] = [];
  public chipListSelectable: ChipListSelectable = ChipListSelectable.multi;
  public config: ChipListConfig = {};
  readonly chipType = ChipType;

  @HostBinding('class.empty') get isEmpty() {
    return !this.chips || !this.chips.length;
  }
  @HostBinding('attr.role') role = 'list';
  @HostBinding('attr.data-align')
  get alignChips() {
    return this.config.align || ChipListAlign.left;
  }
  @HostBinding('attr.data-type')
  get chipsType() {
    return this.config.type || ChipType.tag;
  }

  @HostListener('click', ['$event'])
  onHostClick($event: DOMMouseEvent) {
    const target = $event.target;

    if (!this.config.disabled && target.nodeName.toUpperCase() === 'B-CHIP') {
      const index = parseInt(target.dataset.index, 10);
      const chip = this.chips[index];

      if (chip && !chip.disabled && chip.removable !== false) {
        $event.stopPropagation();
        this.onChipClick($event, chip, index);
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onHostKeydown($event: DOMKeyboardEvent) {
    const target = $event.target;
    if (!this.config.disabled && target.nodeName.toUpperCase() === 'B-CHIP') {
      const index = parseInt(target.dataset.index, 10);
      const chip = this.chips[index];

      if (chip && !chip.disabled && chip.removable !== false) {
        this.onChipKeydown($event, chip, index);
      }
    }
  }

  public onChipRemove(chip: Chip): void {}

  public onChipClick(event: DOMMouseEvent, chip: Chip, index: number): void {
    if (this.config.selectable) {
      this.selectChip(chip, index);
    }
  }

  protected onChipKeydown(
    event: DOMKeyboardEvent,
    chip: Chip,
    index: number
  ): void {
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

  protected selectChip(chip: Chip, index: number): boolean {
    const isSelected = chip.selected;

    if (this.chipListSelectable === ChipListSelectable.single) {
      if (!isSelected) {
        this.deselectAllChips();
        chip.selected = true;
      }
    } else {
      chip.selected = !isSelected;
    }

    return isSelected;
  }

  protected deselectAllChips(): void {
    this.chips.forEach((chip) => {
      chip.selected = false;
    });
  }

  protected focusChipElByIndex(index: number): void {
    const chipComp = this.list.toArray()[index];
    if (chipComp) {
      chipComp.chip.focus();
    }
  }

  public chipsTrackBy(index: number, chip: Chip): string | number {
    return chip.id || chip.text || JSON.stringify(chip);
  }
}

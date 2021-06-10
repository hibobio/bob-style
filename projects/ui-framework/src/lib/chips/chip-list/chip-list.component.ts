import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { IconSize } from '../../icons/icons.enum';
import {
  applyChanges,
  hasChanges,
  isNumber,
} from '../../services/utils/functional-utils';
import { arrayOfValuesToArrayOfObjects } from '../../services/utils/transformers';
import { DOMKeyboardEvent, DOMMouseEvent } from '../../types';
import { ChipListSelectable, ChipType } from '../chips.enum';
import { Chip, ChipKeydownEvent, ChipListConfig } from '../chips.interface';
import { ChipListBaseElement } from './chip-list.abstract';

@Component({
  selector: 'b-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipListComponent
  extends ChipListBaseElement
  implements OnChanges {
  constructor(protected zone: NgZone, protected cd: ChangeDetectorRef) {
    super(zone, cd);
  }

  @Input() chipListSelectable: ChipListSelectable = ChipListSelectable.multi;

  @Input() activeIndex: number;
  @Input() chips: (Chip | any)[] = [];
  @Input() config: ChipListConfig = {};

  readonly avatarSize = AvatarSize;
  readonly iconSize = IconSize;

  @Output() removed: EventEmitter<Chip> = new EventEmitter();
  @Output() selected: EventEmitter<Chip> = new EventEmitter();
  @Output() clicked: EventEmitter<Chip> = new EventEmitter();
  @Output()
  keyPressed: EventEmitter<ChipKeydownEvent> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        config: {},
        chipListSelectable: ChipListSelectable.multi,
      },
      ['chips'],
      true
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

    // this corrects the automatically set chipListSelectable to the input value
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

  public onChipRemove(chip: Chip): void {
    if (this.removed.observers) {
      this.removed.emit(chip);
    }
  }

  public onChipClick(event: DOMMouseEvent, chip: Chip, index: number): void {
    super.onChipClick(event, chip, index);

    if (this.clicked.observers) {
      this.clicked.emit(chip);
    }
  }

  protected onChipKeydown(
    event: DOMKeyboardEvent,
    chip: Chip,
    index: number
  ): void {
    super.onChipKeydown(event, chip, index);

    if (this.keyPressed.observers) {
      this.keyPressed.emit({ event, chip });
    }
  }

  protected selectChip(chip: Chip, index: number): boolean {
    const isSelected = super.selectChip(chip, index);

    if (chip.selected !== isSelected && this.selected.observers) {
      this.selected.emit(chip);
    }

    return isSelected;
  }

  private isTypeTabs() {
    return (
      this.config.type === ChipType.tab || this.config.type === ChipType.button
    );
  }
}

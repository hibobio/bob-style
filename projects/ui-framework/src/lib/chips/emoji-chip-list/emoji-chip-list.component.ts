import { Component, EventEmitter, Input, Output } from '@angular/core';

import { isFunction } from '../../services/utils/functional-utils';
import { EmojiChip } from './emoji-chip-list.interface';

@Component({
  selector: 'b-emoji-chip-list',
  templateUrl: './emoji-chip-list.component.html',
  styleUrls: ['./emoji-chip-list.component.scss'],
})
export class EmojiChipListComponent {
  @Input() valueFormatter: Function;
  @Input() chips: EmojiChip[];
  @Output()
  chipClicked: EventEmitter<EmojiChip> = new EventEmitter();

  valueFormatterFn(val): string | number {
    return isFunction(this.valueFormatter) ? this.valueFormatter(val) : val;
  }

  chipClick(chip: EmojiChip) {
    this.chipClicked.emit(chip);
  }

  trackBy(index: number, chip: EmojiChip): string {
    return index + chip.emoji;
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmojiChip } from './emoji-chip-list.interface';
import { isFunction } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-emoji-chip-list',
  templateUrl: './emoji-chip-list.component.html',
  styleUrls: ['./emoji-chip-list.component.scss'],
})
export class EmojiChipListComponent {
  @Input() valueFormatter: Function;
  @Input() chips: EmojiChip[];
  @Output() chipClicked = new EventEmitter<EmojiChip>();

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

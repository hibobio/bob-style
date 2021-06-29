import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Types } from '../../enums';

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
  @HostBinding('attr.data-type') @Input() dataType: Types = Types.primary;

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

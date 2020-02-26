import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiChipListComponent } from './emoji-chip-list.component';
import { EmojiFromCodePipe } from './emoji-from-code.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [EmojiChipListComponent, EmojiFromCodePipe],
  imports: [CommonModule, MatTooltipModule],
  exports: [EmojiChipListComponent, EmojiFromCodePipe],
})
export class EmojiChipListModule {}

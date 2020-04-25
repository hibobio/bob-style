import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipListComponent } from './chip-list.component';
import { ChipModule } from '../chip/chip.module';
import { AvatarModule } from '../../avatar/avatar/avatar.module';

@NgModule({
  declarations: [ChipListComponent],
  imports: [CommonModule, ChipModule, AvatarModule],
  exports: [ChipListComponent],
  providers: [],
})
export class ChipListModule {}

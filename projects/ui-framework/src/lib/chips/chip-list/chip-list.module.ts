import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipListComponent } from './chip-list.component';
import { ChipModule } from '../chip/chip.module';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { ChipListBaseElement } from './chip-list.abstract';

@NgModule({
  declarations: [ChipListComponent, ChipListBaseElement],
  imports: [CommonModule, ChipModule, AvatarModule],
  exports: [ChipListComponent, ChipListBaseElement],
  providers: [],
})
export class ChipListModule {}

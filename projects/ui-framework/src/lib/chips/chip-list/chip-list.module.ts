import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipListComponent } from './chip-list.component';
import { ChipModule } from '../chip/chip.module';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [ChipListComponent],
  imports: [CommonModule, ChipModule, AvatarModule],
  exports: [ChipListComponent],
  providers: [EventManagerPlugins[0]]
})
export class ChipListModule {}

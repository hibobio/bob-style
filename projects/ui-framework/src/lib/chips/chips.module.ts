import { NgModule } from '@angular/core';
import { ChipComponent } from './chip/chip.component';
import { ChipInputComponent } from './chip-input/chip-input.component';
import { ChipModule } from './chip/chip.module';
import { ChipInputModule } from './chip-input/chip-input.module';
import { ChipListComponent } from './chip-list/chip-list.component';
import { ChipListModule } from './chip-list/chip-list.module';
import { EventManagerPlugins } from '../services/utils/eventManager.plugins';

@NgModule({
  declarations: [],
  imports: [ChipModule, ChipListModule, ChipInputModule],
  exports: [ChipComponent, ChipListComponent, ChipInputComponent],
  providers: [EventManagerPlugins[0]],
})
export class ChipsModule {}

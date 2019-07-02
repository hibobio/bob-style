import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipModule } from '../chip/chip.module';
import { MultiListAndChipsComponent } from './multi-list-and-chips.component';
import { MultiListModule } from '../../form-elements/lists/multi-list/multi-list.module';
import { ChipListModule } from '../chip-list/chip-list.module';

@NgModule({
  declarations: [MultiListAndChipsComponent],
  imports: [CommonModule, ChipModule, ChipListModule, MultiListModule],
  exports: [MultiListAndChipsComponent],
  providers: []
})
export class MultiListAndChipsModule {}

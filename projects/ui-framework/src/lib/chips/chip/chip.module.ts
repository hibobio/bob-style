import { NgModule } from '@angular/core';
import { ChipComponent } from './chip.component';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [ChipComponent],
  imports: [CommonModule, IconsModule],
  exports: [ChipComponent],
  providers: [],
})
export class ChipModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipInputComponent } from './chip-input.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IconsModule } from '../../icons/icons.module';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { ChipModule } from '../../buttons-indicators/chip/chip.module';

@NgModule({
  declarations: [ChipInputComponent],
  imports: [
    CommonModule,
    ChipModule,
    MatAutocompleteModule,
    IconsModule,
    InputMessageModule
  ],
  exports: [ChipInputComponent],
  providers: []
})
export class ChipInputModule {}

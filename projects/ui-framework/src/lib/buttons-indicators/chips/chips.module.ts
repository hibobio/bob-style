import { NgModule } from '@angular/core';
import { ChipComponent } from './chip/chip.component';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color-service/color.service';
import { ChipInputComponent } from './chip-input/chip-input.component';
import { MatAutocompleteModule, MatChipsModule, MatFormFieldModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [ChipComponent, ChipInputComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    IconsModule
  ],
  exports: [ChipComponent, ChipInputComponent],
  providers: [ColorService]
})
export class ChipsModule {}

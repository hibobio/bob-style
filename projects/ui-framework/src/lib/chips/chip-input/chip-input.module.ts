import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipInputComponent } from './chip-input.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IconsModule } from '../../icons/icons.module';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { ChipModule } from '../chip/chip.module';
import { ChipListModule } from '../chip-list/chip-list.module';
import { UtilsService } from '../../services/utils/utils.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@NgModule({
  declarations: [ChipInputComponent],
  imports: [
    CommonModule,
    ChipModule,
    ChipListModule,
    MatAutocompleteModule,
    IconsModule,
    InputMessageModule,
  ],
  exports: [ChipInputComponent],
  providers: [UtilsService, DOMhelpers, EventManagerPlugins[0]],
})
export class ChipInputModule {}

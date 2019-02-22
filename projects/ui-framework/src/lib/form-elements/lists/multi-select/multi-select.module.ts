import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import { PanelModule } from '../../../overlay/panel/panel.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { InputModule } from '../../input/input.module';
import { MultiListModule } from '../multi-list/multi-list.module';
import { MatTooltipModule } from '@angular/material';
import { IconsModule } from '../../../icons/icons.module';

@NgModule({
  declarations: [MultiSelectComponent],
  imports: [
    CommonModule,
    PanelModule,
    ButtonsModule,
    OverlayModule,
    MultiListModule,
    InputModule,
    MatTooltipModule,
    IconsModule
  ],
  exports: [MultiSelectComponent],
  providers: []
})
export class MultiSelectModule {}

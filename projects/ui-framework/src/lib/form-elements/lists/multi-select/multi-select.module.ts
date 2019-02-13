import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import { PanelModule } from '../../../overlay/panel/panel.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { OverlayModule } from '@angular/cdk/overlay';
import { InputModule } from '../../input';
import { MultiListModule } from '../multi-list/multi-list.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material';
import { IconsModule } from '../../../icons';

@NgModule({
  declarations: [
    MultiSelectComponent,
  ],
  imports: [
    CommonModule,
    PanelModule,
    ButtonsModule,
    OverlayModule,
    MultiListModule,
    InputModule,
    FlexLayoutModule,
    MatTooltipModule,
    IconsModule,
  ],
  exports: [
    MultiSelectComponent,
  ],
  providers: [
  ],
})
export class MultiSelectModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectPanelComponent } from './multi-select-panel.component';
import { TypographyModule } from '../../../typography/typography.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { PanelModule } from '../../../popups/panel/panel.module';
import { InputModule } from '../../input/input.module';
import { MultiListModule } from '../multi-list/multi-list.module';

@NgModule({
  declarations: [
    MultiSelectPanelComponent,
  ],
  imports: [
    CommonModule,
    TypographyModule,
    ButtonsModule,
    OverlayModule,
    MultiListModule,
    PanelModule,
    InputModule,
  ],
  exports: [
    MultiSelectPanelComponent,
  ],
})
export class MultiSelectPanelModule {
}

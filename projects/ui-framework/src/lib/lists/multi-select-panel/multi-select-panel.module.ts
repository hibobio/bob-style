import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectPanelComponent } from './multi-select-panel.component';
import { TypographyModule } from '../../typography/typography.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { InputModule } from '../../form-elements/input/input.module';
import { MultiListModule } from '../multi-list/multi-list.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MultiSelectPanelComponent],
  imports: [
    CommonModule,
    TypographyModule,
    ButtonsModule,
    OverlayModule,
    MultiListModule,
    InputModule,
    TranslateModule,
  ],
  exports: [MultiSelectPanelComponent],
})
export class MultiSelectPanelModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyModule } from '../../typography/typography.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { SingleSelectPanelComponent } from './single-select-panel.component';
import { SingleListModule } from '../single-list/single-list.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { PanelModule } from '../../popups/panel/panel.module';
import { InputModule } from '../../form-elements/input/input.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SingleSelectPanelComponent],
  imports: [
    CommonModule,
    TypographyModule,
    ButtonsModule,
    OverlayModule,
    SingleListModule,
    PanelModule,
    InputModule,
    TranslateModule,
  ],
  exports: [SingleSelectPanelComponent],
})
export class SingleSelectPanelModule {}

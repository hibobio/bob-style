import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyModule } from '../../typography/typography.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { SingleListMenuComponent } from './single-list-menu.component';
import { SingleListModule } from '../../form-elements/lists/single-list/single-list.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { PanelModule } from '../../popups/panel/panel.module';
import { InputModule } from '../../form-elements/input/input.module';

@NgModule({
  declarations: [
    SingleListMenuComponent,
  ],
  imports: [
    CommonModule,
    TypographyModule,
    ButtonsModule,
    OverlayModule,
    SingleListModule,
    PanelModule,
    InputModule,
  ],
  exports: [
    SingleListMenuComponent,
  ],
})
export class SingleListMenuModule {
}

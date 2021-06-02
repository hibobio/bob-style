import { NgModule } from '@angular/core';

import { InfoGraphicTextComponent } from './info-graphic-text.component';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '../../buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';


@NgModule({
  imports: [
    CommonModule,
    ButtonsModule,
    IconsModule,
  ],
  exports: [
    InfoGraphicTextComponent,
  ],
  declarations: [InfoGraphicTextComponent],
  providers: [],
})
export class InfoGraphicTextModule {
}

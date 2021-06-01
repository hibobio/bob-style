import { NgModule } from '@angular/core';

import { InfoGraphicTextComponent } from './info-graphic-text.component';
import { TypographyModule } from '../../typography/typography.module';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '../../buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';


@NgModule({
  imports: [
    TypographyModule,
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

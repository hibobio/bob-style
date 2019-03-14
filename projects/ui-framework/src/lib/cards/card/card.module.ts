import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { MenuModule } from '../../navigation/menu/menu.module';
import { CardComponent } from './card.component';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, ButtonsModule, TypographyModule, MenuModule],
  exports: [CardComponent],
  providers: []
})
export class CardModule {}

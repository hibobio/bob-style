import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../typography/typography.module';
import { MenuModule } from '../navigation/menu/menu.module';
import { CardComponent } from './card/card.component';
import { CardAddComponent } from './card-add/card-add.component';
import { CardsLayoutComponent } from './cards-layout/cards-layout.component';
import { ComponentRendererModule } from '../services/component-renderer/component-renderer.module';
import { TruncateTooltipModule } from '../services/truncate-tooltip/truncate-tooltip.module';

@NgModule({
  declarations: [CardComponent, CardAddComponent, CardsLayoutComponent],
  imports: [CommonModule, ButtonsModule, TypographyModule, MenuModule, ComponentRendererModule, TruncateTooltipModule],
  exports: [CardComponent, CardAddComponent, CardsLayoutComponent],
  providers: []
})
export class CardsModule {}

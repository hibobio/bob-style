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
import { CardEmployeeComponent } from './card-employee/card-employee.component';
import { AvatarModule } from '../buttons-indicators/avatar/avatar.module';
import { EventManagerPlugins } from '../services/utils/eventManager.plugins';

@NgModule({
  declarations: [
    CardComponent,
    CardAddComponent,
    CardEmployeeComponent,
    CardsLayoutComponent,
  ],
  imports: [
    CommonModule,
    ButtonsModule,
    TypographyModule,
    MenuModule,
    ComponentRendererModule,
    TruncateTooltipModule,
    AvatarModule
  ],
  exports: [
    CardComponent,
    CardAddComponent,
    CardEmployeeComponent,
    CardsLayoutComponent,
  ],
  providers: [EventManagerPlugins[0]]
})
export class CardsModule {}

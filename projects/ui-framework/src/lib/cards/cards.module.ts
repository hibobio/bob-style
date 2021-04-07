import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AvatarModule } from '../avatar/avatar/avatar.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { MenuModule } from '../navigation/menu/menu.module';
import { TruncateTooltipModule } from '../popups/truncate-tooltip/truncate-tooltip.module';
import { ComponentRendererModule } from '../services/component-renderer/component-renderer.module';
import { EventManagerPlugins } from '../services/utils/eventManager.plugins';
import { TypographyModule } from '../typography/typography.module';
import { CardAddComponent } from './card-add/card-add.component';
import { CardEmployeeComponent } from './card-employee/card-employee.component';
import { CardImageComponent } from './card-image/card-image.component';
import { CardComponent } from './card/card.component';
import { CardsLayoutComponent } from './cards-layout/cards-layout.component';

@NgModule({
  declarations: [
    CardComponent,
    CardAddComponent,
    CardEmployeeComponent,
    CardsLayoutComponent,
    CardImageComponent,
  ],
  imports: [
    CommonModule,
    ButtonsModule,
    TypographyModule,
    MenuModule,
    ComponentRendererModule,
    TruncateTooltipModule,
    AvatarModule,
  ],
  exports: [
    CardComponent,
    CardAddComponent,
    CardEmployeeComponent,
    CardsLayoutComponent,
    CardImageComponent,
  ],
  providers: [EventManagerPlugins[0]],
})
export class CardsModule {}

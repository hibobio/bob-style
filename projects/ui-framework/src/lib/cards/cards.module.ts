import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../typography/typography.module';
import { MenuModule } from '../navigation/menu/menu.module';
import { CardComponent } from './card/card.component';
import { CardAddComponent } from './card-add/card-add.component';
import { CardsLayoutComponent } from './cards-layout/cards-layout.component';
import { MiniEmployeeCardComponent } from './mini-card-employee/mini-card-employee.component';
import { ComponentRendererModule } from '../services/component-renderer/component-renderer.module';
import { TruncateTooltipModule } from '../services/truncate-tooltip/truncate-tooltip.module';
import { EmployeeCardComponent } from './card-employee/card-employee.component';
import { AvatarModule } from '../buttons-indicators/avatar/avatar.module';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { OutsideZonePlugin } from '../services/utils/eventManager.plugins';

@NgModule({
  declarations: [
    CardComponent,
    CardAddComponent,
    EmployeeCardComponent,
    CardsLayoutComponent,
    MiniEmployeeCardComponent
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
    EmployeeCardComponent,
    CardsLayoutComponent,
    MiniEmployeeCardComponent
  ],
  providers: [
    {
      multi: true,
      provide: EVENT_MANAGER_PLUGINS,
      useClass: OutsideZonePlugin
    }
  ]
})
export class CardsModule {}

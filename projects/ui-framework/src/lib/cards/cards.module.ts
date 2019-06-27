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
import { EmployeeCardComponent } from './card-employee/card-employee.component';
import { AvatarModule } from '../buttons-indicators/avatar/avatar.module';

@NgModule({
  declarations: [
    CardComponent,
    CardAddComponent,
    EmployeeCardComponent,
    CardsLayoutComponent
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
    CardsLayoutComponent
  ],
  providers: []
})
export class CardsModule {}

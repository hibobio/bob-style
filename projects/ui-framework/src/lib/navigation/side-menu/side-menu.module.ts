import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu.component';
import { SideMenuOptionComponent } from './side-menu-option/side-menu-option.component';
import { MenuModule } from '../menu/menu.module';
import { IconsModule } from '../../icons/icons.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';

@NgModule({
  declarations: [
    SideMenuComponent,
    SideMenuOptionComponent,
  ],
  imports: [
    CommonModule,
    IconsModule,
    MenuModule,
    TruncateTooltipModule,
    ButtonsModule,
    TypographyModule,
  ],
  exports: [
    SideMenuComponent,
  ]
})
export class SideMenuModule {
}

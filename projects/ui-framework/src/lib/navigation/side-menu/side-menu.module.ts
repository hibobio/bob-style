import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu.component';
import { SideMenuOptionComponent } from './side-menu-option/side-menu-option.component';
import { MenuModule } from '../menu/menu.module';
import { IconsModule } from '../../icons/icons.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';

@NgModule({
  declarations: [
    SideMenuComponent,
    SideMenuOptionComponent,
  ],
  imports: [
    CommonModule,
    IconsModule,
    MenuModule,
    MatTooltipModule,
    ButtonsModule,
  ],
  exports: [
    SideMenuComponent,
  ]
})
export class SideMenuModule {
}

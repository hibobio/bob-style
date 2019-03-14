import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu.component';
import { SideMenuOptionComponent } from './side-menu-option/side-menu-option.component';
import { MenuModule } from '../menu/menu.module';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [
    SideMenuComponent,
    SideMenuOptionComponent,
  ],
  imports: [
    CommonModule,
    IconsModule,
    MenuModule,
  ],
  exports: [
    SideMenuComponent,
  ]
})
export class SideMenuModule {
}

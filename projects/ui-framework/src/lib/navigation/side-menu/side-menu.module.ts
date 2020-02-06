import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu.component';
import { MenuModule } from '../menu/menu.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { AvatarModule } from '../../avatar/avatar/avatar.module';

@NgModule({
  declarations: [SideMenuComponent],
  imports: [
    CommonModule,
    MenuModule,
    TruncateTooltipModule,
    ButtonsModule,
    AvatarModule,
  ],
  exports: [SideMenuComponent],
  providers: [EventManagerPlugins[0]],
})
export class SideMenuModule {}

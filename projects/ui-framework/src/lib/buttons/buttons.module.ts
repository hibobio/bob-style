import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MenuModule } from '../navigation/menu/menu.module';
import { EventManagerPlugins } from '../services/utils/eventManager.plugins';
import { ActionMenuButtonComponent } from './action-menu-button/action-menu-button.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { ButtonComponent } from './button/button.component';
import { ChevronButtonComponent } from './chevron-button/chevron-button.component';
import { GroupComponent } from './group/group.component';
import { RoundButtonComponent } from './round/round.component';
import { SquareButtonComponent } from './square/square.component';
import { TextButtonComponent } from './text-button/text-button.component';

@NgModule({
  declarations: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent,
    BackButtonComponent,
    TextButtonComponent,
    ChevronButtonComponent,
    ActionMenuButtonComponent,
    RoundButtonComponent,
  ],
  imports: [CommonModule, MenuModule],
  exports: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent,
    BackButtonComponent,
    TextButtonComponent,
    ChevronButtonComponent,
    ActionMenuButtonComponent,
    RoundButtonComponent,
  ],
  providers: [EventManagerPlugins[0]],
})
export class ButtonsModule {}

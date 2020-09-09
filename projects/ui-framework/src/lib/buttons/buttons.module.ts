import { NgModule } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { SquareButtonComponent } from './square/square.component';
import { GroupComponent } from './group/group.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { CommonModule } from '@angular/common';
import { TextButtonComponent } from './text-button/text-button.component';
import { ChevronButtonComponent } from './chevron-button/chevron-button.component';
import { ActionMenuButtonComponent } from './action-menu-button/action-menu-button.component';
import { MenuModule } from '../navigation/menu/menu.module';
import { RoundButtonComponent } from './round/round.component';

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
})
export class ButtonsModule {}

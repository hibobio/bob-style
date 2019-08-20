import { NgModule } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { SquareButtonComponent } from './square/square.component';
import { GroupComponent } from './group/group.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { CommonModule } from '@angular/common';
import { TextButtonComponent } from './text-button/text-button.component';
import { ChevronButtonComponent } from './chevron-button/chevron-button.component';

@NgModule({
  declarations: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent,
    BackButtonComponent,
    TextButtonComponent,
    ChevronButtonComponent
  ],
  imports: [CommonModule],
  exports: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent,
    BackButtonComponent,
    TextButtonComponent,
    ChevronButtonComponent
  ]
})
export class ButtonsModule {}

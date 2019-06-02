import { NgModule } from '@angular/core';
import { MatButtonModule, MatRippleModule } from '@angular/material';
import { ButtonComponent } from './button/button.component';
import { SquareButtonComponent } from './square/square.component';
import { GroupComponent } from './group/group.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { TextButtonComponent } from './text-button/text-button.component';
import { TypographyModule } from '../../typography/typography.module';

@NgModule({
  declarations: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent,
    BackButtonComponent,
    TextButtonComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatRippleModule,
    IconsModule,
    TypographyModule,
  ],
  exports: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent,
    BackButtonComponent,
    TextButtonComponent,
  ]
})
export class ButtonsModule { }

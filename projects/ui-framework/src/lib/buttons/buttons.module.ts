import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatRippleModule } from '@angular/material';
import { ButtonComponent } from './button/button.component';
import { SquareButtonComponent } from '../buttons/square/square.component';
import { GroupComponent } from './group/group.component';
import { BackButtonComponent } from '../buttons/back-button/back-button.component';

@NgModule({
  declarations: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent,
    BackButtonComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatRippleModule
  ],
  exports: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent,
    BackButtonComponent
  ]
})
export class ButtonsModule { }

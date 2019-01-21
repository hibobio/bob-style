import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule, DatepickerModule, InputModule, SelectModule, TextareaModule, TypographyModule } from 'bob-style';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TypographyModule,
    DatepickerModule,
    ButtonsModule,
    DatepickerModule,
    InputModule,
    SelectModule,
    TextareaModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

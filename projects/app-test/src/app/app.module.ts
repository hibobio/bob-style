import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypographyModule, ButtonsModule, IconsModule, MultiListModule } from 'bob-style';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TypographyModule,
    ButtonsModule,
    IconsModule,
    MultiListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

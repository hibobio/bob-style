import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsModule } from '../icons';
import { InputModule } from '../form-elements/input';

@NgModule({
  declarations: [
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    IconsModule,
    InputModule,
  ],
  exports: [
    SearchComponent,
  ],
  providers: [],
})
export class SearchModule {
}

import {NgModule} from '@angular/core';
import {SliderComponent} from './slider.component';
import {MatSliderModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';

@NgModule({
  declarations: [SliderComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatSliderModule,
  ],
  exports: [
    SliderComponent,
  ],
  providers: [],
})
export class SliderModule {
}

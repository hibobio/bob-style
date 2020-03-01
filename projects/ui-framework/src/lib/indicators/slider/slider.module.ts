import {NgModule} from '@angular/core';
import {SliderComponent} from './slider.component';
import { MatSliderModule } from '@angular/material/slider';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [SliderComponent],
  imports: [
    CommonModule,
    MatSliderModule,
  ],
  exports: [
    SliderComponent,
  ],
  providers: [],
})
export class SliderModule {
}

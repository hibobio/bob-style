import { NgModule } from '@angular/core';

import { ColorPickerComponent } from './color-picker.component';
import { ColorPickerModule as ColorPickerModule3rdParty } from 'ngx-color-picker';
import { CommonModule } from '@angular/common';
import { FormElementLabelModule, InputMessageModule } from 'bob-style';
import { OverlayModule } from '@angular/cdk/overlay';


@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule3rdParty,
    FormElementLabelModule,
    InputMessageModule,
    OverlayModule
  ],
  exports: [ColorPickerComponent],
  declarations: [ColorPickerComponent],
  providers: [],
})
export class ColorPickerModule {
}

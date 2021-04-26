import { ColorPickerModule as ColorPickerModule3rdParty } from 'ngx-color-picker';

import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormElementLabelModule } from '../form-element-label/form-element-label.module';
import { InputMessageModule } from '../input-message/input-message.module';
import { ColorPickerComponent } from './color-picker.component';

@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule3rdParty,
    FormElementLabelModule,
    InputMessageModule,
    OverlayModule,
  ],
  exports: [ColorPickerComponent],
  declarations: [ColorPickerComponent],
  providers: [],
})
export class ColorPickerModule {}

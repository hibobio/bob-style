import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RadioButtonComponent} from './radio-button.component';
import {MatRadioModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    RadioButtonComponent,
  ],
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule,
  ],
  exports: [
    RadioButtonComponent,
  ],
})
export class RadioButtonModule {
}

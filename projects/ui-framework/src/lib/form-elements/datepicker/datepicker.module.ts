import {NgModule} from '@angular/core';
import {DatepickerComponent} from './datepicker.component';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IconsModule} from '../../icons';
import {CommonModule} from '@angular/common';
import {InputModule} from '../input/input.module';
import {DatepickerInputComponent} from './datepicker-input.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    DatepickerInputComponent,
    DatepickerComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    IconsModule,
    MatInputModule,
    InputModule,
    FormsModule
  ],
  exports: [
    DatepickerComponent,
  ],
  entryComponents: [
    DatepickerComponent,
  ],
  providers: [],
})
export class DatepickerModule {
}

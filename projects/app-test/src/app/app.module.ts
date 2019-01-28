import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypographyModule } from '../../../ui-framework/src/lib/typography/typography.module';
import { DatepickerModule } from '../../../ui-framework/src/lib/form-elements/datepicker/datepicker.module';
import { InputModule } from '../../../ui-framework/src/lib/form-elements/input';
import { SelectModule } from '../../../ui-framework/src/lib/form-elements/select';
import { TextareaModule } from '../../../ui-framework/src/lib/form-elements/textarea';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TypographyModule,
    DatepickerModule,
    InputModule,
    SelectModule,
    TextareaModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

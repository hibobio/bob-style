import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypographyModule } from '../../../ui-framework/src/lib/typography/typography.module';
import { DatepickerModule } from '../../../ui-framework/src/lib/form-elements/datepicker/datepicker.module';
import { SearchModule } from '../../../ui-framework/src/lib/form-elements/search';
import { AppRoutingModule } from './app-routing.module';
import { FormComponent } from './details/form/form.component';
import { InputModule } from '../../../ui-framework/src/lib/form-elements/input';
import { TestComponent } from './details/test/test.component';


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    TestComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TypographyModule,
    DatepickerModule,
    SearchModule,
    InputModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }

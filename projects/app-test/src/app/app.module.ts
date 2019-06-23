import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormElementsTestModule } from './form-elements/form-elements.module';
import { UrlTesterModule } from './url-tester/url-tester.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormElementsTestModule,
    UrlTesterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormElementsTestModule } from './form-elements/form-elements.module';
import { UrlTesterModule } from './url-tester/url-tester.module';
import { UtilComponentsModule } from '../../../ui-framework/src/lib/services/util-components/utilComponents.module';
import { TooltipTesterModule } from './truncate-tooltip/truncate-tooltip.module';
import { FormElementsModule } from '../../../ui-framework/src/public_api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormElementsTestModule,
    UrlTesterModule,
    UtilComponentsModule,
    TooltipTesterModule,
    FormElementsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

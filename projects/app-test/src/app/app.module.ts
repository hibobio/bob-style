import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormElementsTestModule } from './form-elements/form-elements.module';
import { UrlTesterModule } from './url-tester/url-tester.module';
import { TooltipTesterModule } from './truncate-tooltip/truncate-tooltip.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventManagerModule } from './event-manager/event-manager.module';
import { ClassBinderTesterModule } from './class-binder/class-binder.module';
import { UrlUtilsModule } from '../../../ui-framework/src/lib/services/url/url-utils.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { UtilsModule } from './utils/utils.module';
import { FormElementsModule } from '../../../ui-framework/src/lib/form-elements/form-elements.module';
import { StatsModule } from '../../../ui-framework/src/lib/services/util-components/stats.module';
import { FilterBarTestModule } from './filter-bar/filter-bar.module';
import { DateParseTesterModule } from './dateparser/dateparse-tester.module';
import { CommonModule } from '@angular/common';
import { TreeSelectModule } from '../../../ui-framework/src/lib/lists/tree-list/tree-select/tree-select.module';
import { CardTableModule } from '../../../ui-framework/src/lib/table/card-table/card-table.module';
import { TreeListComponent } from './tree-list/tree-list.component';
import { TestTableModule } from './test-table/test-table.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AppComponent,
    TreeListComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    EventManagerModule,
    // RouterModule,
    UtilsModule,
    StatsModule,
    AppRoutingModule,
    // FormElementsTestModule,
    // UrlTesterModule,
    // TooltipTesterModule,
    // FormElementsModule,
    // ClassBinderTesterModule,
    // UrlUtilsModule,
    // FilterBarTestModule,
    // DatepickerModule,
    // DateParseTesterModule,
    TreeSelectModule,
    CardTableModule,
    TestTableModule,
    RouterModule,
    TranslateModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule {}

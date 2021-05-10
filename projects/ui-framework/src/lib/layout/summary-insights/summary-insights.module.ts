import { NgModule } from '@angular/core';

import { SummaryInsightsComponent } from './summary-insights.component';
import { CommonModule } from '@angular/common';
import { LabelValueModule, ProgressBarModule, ProgressDonutModule } from 'bob-style';

@NgModule({
  imports: [
    CommonModule,
    LabelValueModule,
    ProgressBarModule,
    ProgressDonutModule,
  ],
  exports: [SummaryInsightsComponent],
  declarations: [SummaryInsightsComponent],
  providers: [],
})
export class SummaryInsightsModule {
}

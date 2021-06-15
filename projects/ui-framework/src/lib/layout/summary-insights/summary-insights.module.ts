import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProgressBarModule } from '../../indicators/progress/progress-bar/progress-bar.module';
import { ProgressDonutModule } from '../../indicators/progress/progress-donut/progress-donut.module';
import { TrackByPropModule } from '../../services/filters/trackByProp.pipe';
import { LabelValueModule } from '../../typography/label-value/label-value.module';
import { SummaryInsightsComponent } from './summary-insights.component';

@NgModule({
  imports: [
    CommonModule,
    LabelValueModule,
    ProgressBarModule,
    ProgressDonutModule,
    TrackByPropModule,
    MatTooltipModule,
  ],
  exports: [SummaryInsightsComponent],
  declarations: [SummaryInsightsComponent],
  providers: [],
})
export class SummaryInsightsModule {}

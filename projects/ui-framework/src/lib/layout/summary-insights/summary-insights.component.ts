import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SummaryInsightType } from './summary-insights.enums';
import { SummaryInsight } from './summary-insights.interfaces';

@Component({
  selector: 'b-summary-insights',
  templateUrl: 'summary-insights.component.html',
  styleUrls: ['summary-insights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryInsightsComponent {
  public readonly type = SummaryInsightType;

  @Input() data: SummaryInsight[];
}

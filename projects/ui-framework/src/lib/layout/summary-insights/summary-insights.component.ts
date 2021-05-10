import { Component, Input, OnInit } from '@angular/core';
import { summaryInsightsDataMock } from './summaryInsights.mocks';
import { SummaryInsight } from './summary-insights.interfaces';
import { SummaryInsightType } from './summary-insights.enums';

@Component({
  selector: 'b-summary-insights',
  templateUrl: 'summary-insights.component.html',
  styleUrls: ['summary-insights.component.scss'],
})

export class SummaryInsightsComponent implements OnInit {
  constructor() {
  }

  public readonly summaryInsightType = SummaryInsightType;

  @Input() data: SummaryInsight[] = summaryInsightsDataMock;

  ngOnInit() {
  }
}

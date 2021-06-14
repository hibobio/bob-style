import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentTemplateConsumer } from '../../services/utils/contentTemplate.directive';
import { SummaryInsightType } from './summary-insights.enum';
import { SummaryInsight } from './summary-insights.interface';

@Component({
  selector: 'b-summary-insights',
  templateUrl: 'summary-insights.component.html',
  styleUrls: ['summary-insights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryInsightsComponent extends ContentTemplateConsumer {
  public readonly type = SummaryInsightType;

  private _data: SummaryInsight[];

  @Input() set data(data: SummaryInsight[]) {
    this._data = data?.map((item) => {
      if (item.type === SummaryInsightType.labelValue) {
        item.data = {
          labelClass: {
            flx: false,
            blk: true,
          },
          valueClass: {
            flx: false,
            blk: true,
          },
          ...item.data,
        };
      }
      return item;
    });
  }

  get data(): SummaryInsight[] {
    return this._data;
  }
}

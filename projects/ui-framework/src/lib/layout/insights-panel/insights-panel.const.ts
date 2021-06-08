import { Icons } from '../../icons/icons.enum';
import { InsightsPanelConfig } from './insights-panel.interface';

export const INSIGHTS_PANEL_CONFIG_DEF: InsightsPanelConfig = {
  collapsible: true,
  showMoreAfterItem: false,
  showMoreText: 'common.view-more',
  showLessText: 'common.view-less',
  readMoreLinkText: 'common.read_more',
  icon: Icons.graph_timeline,
  maxLines: null,
  expandButtonText: 'Insights',
};

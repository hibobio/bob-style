import { Icons } from '../../icons/icons.enum';
import { InsightsPanelConfig } from './insights-panel.interface';

export const INSIGHTS_PANEL_CONFIG_DEF: InsightsPanelConfig = {
  collapsible: true,
  showMoreAfterItem: false,
  showMoreText: 'Show More',
  showLessText: 'Show Less',
  readMoreLinkText: 'Read More',
  icon: Icons.graph_timeline,
  maxLines: null,
  expandButtonText: 'Insights',
};

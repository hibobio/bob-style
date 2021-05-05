import { Icons } from '../../icons/icons.enum';
import { InsightsPanelConfig } from './insight-panel.interfaces';

export const INSIGHTS_PANEL_CONFIG_DEF: InsightsPanelConfig = {
  collapsible: true,
  icon: Icons.graph_timeline,

  expandButtonText: 'INSIGHTS',
  maxLines: 3,
};

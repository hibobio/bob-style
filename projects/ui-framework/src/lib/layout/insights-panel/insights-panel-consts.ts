import { InsightsPanelConfig } from './insight-panel.interfaces';
import { IconColor, Icons, IconSize } from 'bob-style';

export const INSIGHTS_PANEL_CONFIG_DEF: InsightsPanelConfig = {
  collapsible: true,
  icon: {
    color: IconColor.dark,
    size: IconSize.medium,
    type: Icons.graph_timeline,
  },
  expandButtonText: 'INSIGHTS',
  maxLines: 3,
};

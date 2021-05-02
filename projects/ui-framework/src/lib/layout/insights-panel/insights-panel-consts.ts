import { InsightsPanelConfig } from './insight-panel.interfaces';
import { IconColor, Icons, IconSize } from 'bob-style';

export const INSIGHTS_PANEL_CONFIG_DEF: InsightsPanelConfig = {
  collapsible: true,
  iconColor: IconColor.dark,
  iconSize: IconSize.medium,
  iconType: Icons.graph_timeline,
  isBorderRadius: true,
  maxLines: 3
};

import { IconColor, Icons, IconSize } from 'bob-style';

export interface InsightsPanelData {
  title: string,
  content: string,
  icon?: Icons
}

export interface InsightsPanelConfig {
  collapsible?: boolean,
  iconColor?: IconColor,
  iconSize?: IconSize,
  iconType?: Icons,
  isBorderRadius?: boolean,
  maxLines?: number
}

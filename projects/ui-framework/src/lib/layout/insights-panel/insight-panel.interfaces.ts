import { IconColor, Icons, IconSize } from 'bob-style';

export interface InsightsPanelData {
  title: string,
  content: string,
  icon?: {
    color?: IconColor,
    size?: IconSize,
    type?: Icons,
  }
}

export interface InsightsPanelConfig {
  collapsible?: boolean,
  icon?: {
    color?: IconColor,
    size?: IconSize,
    type?: Icons,
  },
  maxLines?: number,
  expandButtonText: string
}

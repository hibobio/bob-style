import { Icons } from '../../icons/icons.enum';

export interface InsightsPanelData {
  title: string;
  content: string;
  icon?: Icons;
}

export interface InsightsPanelConfig {
  collapsible?: boolean;
  icon?: Icons;
  maxLines?: number;
  expandButtonText: string;
}

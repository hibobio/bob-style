import { Icons } from '../../icons/icons.enum';
import { NgClass } from '../../services/html/html-helpers.interface';
import { GenericObject } from '../../types';

export interface InsightsPanelData {
  title: string;
  content: string;
  icon?: Icons;
}

export interface InsightsPanelConfig {
  collapsible?: boolean;
  showMoreAfterItem?: number | null;
  expandButtonPosition?: 'top' | 'side';

  icon?: Icons;
  maxLines?: number;

  showMoreText?: string;
  showLessText?: string;
  expandButtonText?: string;
  readMoreLinkText?: string;

  panelClass?: string | string[] | NgClass;
  panelStyle?: GenericObject<string>;
  headingClass?: string | string[] | NgClass;
  headingStyle?: GenericObject<string>;
  sectionClass?: string | string[] | NgClass;
  sectionStyle?: GenericObject<string>;
}

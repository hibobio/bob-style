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
  icon?: Icons;
  maxLines?: number;
  expandButtonText?: string;
  readMoreLinkText?: string;

  headingClass?: string | string[] | NgClass;
  headingStyle?: GenericObject<string>;
  sectionClass?: string | string[] | NgClass;
  sectionStyle?: GenericObject<string>;
}

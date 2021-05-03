import { NgClass } from '../../services/html/html-helpers.interface';
import { GenericObject } from '../../types';

export interface EELayoutConfig {
  headerClass?: string | string[] | NgClass;
  headerStyle?: GenericObject<string>;

  sectionClass?: string | string[] | NgClass;
  sectionStyle?: GenericObject<string>;

  sidebarClass?: string | string[] | NgClass;
  sidebarStyle?: GenericObject<string>;

  sectionTitleClass?: string | string[] | NgClass;
  sectionTitleStyle?: GenericObject<string>;

  contentClass?: string | string[] | NgClass;
  contentStyle?: GenericObject<string>;
}

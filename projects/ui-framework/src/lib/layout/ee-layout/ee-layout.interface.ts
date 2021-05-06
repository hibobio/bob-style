import { NgClass } from '../../services/html/html-helpers.interface';
import { GenericObject } from '../../types';

export interface EELayoutConfig {
  headerClass?: string | string[] | NgClass;
  headerStyle?: GenericObject<string>;

  sidebarClass?: string | string[] | NgClass;
  sidebarStyle?: GenericObject<string>;

  sectionHeaderClass?: string | string[] | NgClass;
  sectionHeaderStyle?: GenericObject<string>;

  contentHeaderClass?: string | string[] | NgClass;
  contentHeaderStyle?: GenericObject<string>;

  contentClass?: string | string[] | NgClass;
  contentStyle?: GenericObject<string>;

  contentFooterClass?: string | string[] | NgClass;
  contentFooterStyle?: GenericObject<string>;
}

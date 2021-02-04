import { Icon } from '../../icons/icon.interface';
import { NgClass } from '../../services/html/html-helpers.interface';
import { GenericObject } from '../../types';

export interface CollapsibleStyle {
  sectionClass?: string | string[] | NgClass;
  sectionStyle?: GenericObject<string>;

  headerClass?: string | string[] | NgClass;
  headerStyle?: GenericObject<string>;

  panelClass?: string | string[] | NgClass;
  panelStyle?: GenericObject<string>;

  chevronIcon?: Icon;
}

import { CollapsibleOptions } from '../collapsible-section/collapsible-section.interface';

export interface SortableCollapsibleSection {
  id: string | number;
  title?: string;
  description?: string;
  expanded?: boolean;
  collapsibleOptions?: CollapsibleOptions;
  contentData?: any;
  headerData?: any;
}

export interface SortableCollapsibleDropped {
  currentIndex: number;
  previousIndex: number;
  sections: SortableCollapsibleSection[];
}

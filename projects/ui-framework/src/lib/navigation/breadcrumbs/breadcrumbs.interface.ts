import { BreadcrumbsStepState } from './breadcrumbs.enum';

export interface Breadcrumb {
  title: string;
  state?: BreadcrumbsStepState;
}

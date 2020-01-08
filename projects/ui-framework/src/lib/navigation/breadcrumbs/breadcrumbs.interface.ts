import { BreadcrumbsStepState } from './breadcrumbs.enum';

export interface Breadcrumb {
  title: string;
  state?: BreadcrumbsStepState;
}

export interface BreadcrumbNavButton {
  label: string;
  isVisible?: boolean;
  disabled?: boolean;
}

export interface BreadcrumbNavButtons {
  nextBtn?: BreadcrumbNavButton;
  backBtn?: BreadcrumbNavButton;
}

export interface BreadcrumbsConfig {
  isOpen?: boolean;
  alwaysShowTitle?: boolean;
  autoChangeSteps?: boolean;
  autoDisableButtons?: boolean;
  autoHideButtons?: boolean;
}

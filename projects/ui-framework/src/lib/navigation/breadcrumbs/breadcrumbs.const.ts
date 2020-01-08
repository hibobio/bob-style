import {
  BreadcrumbsConfig,
  BreadcrumbNavButtons,
} from './breadcrumbs.interface';

export const BREADCRUMBS_CONFIG_DEF: BreadcrumbsConfig = {
  isOpen: false,
  alwaysShowTitle: false,
  autoChangeSteps: false,
  autoDisableButtons: false,
  autoHideButtons: false,
};

export const BREADCRUMBS_BUTTONS_DEF: BreadcrumbNavButtons = {
  nextBtn: {
    label: 'Next',
    isVisible: true,
    disabled: false,
  },
  backBtn: {
    label: 'Back',
    isVisible: true,
    disabled: false,
  },
};

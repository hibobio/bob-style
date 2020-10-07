import { Icons } from '../../icons/icons.enum';

export interface ProgressData {
  value: number;
  color?: string;
  trackColor?: string;
  headerTextPrimary?: string | boolean;
  headerTextSecondary?: string | boolean;
  iconHeaderRight?: Icons;
}

export interface ProgressConfig {
  disableAnimation?: boolean;
  hideValue?: boolean;
  clickable?: boolean;
}

// tslint:disable-next-line: no-empty-interface
export interface ProgressBarData extends ProgressData {}

// tslint:disable-next-line: no-empty-interface
export interface ProgressBarConfig extends ProgressConfig {}

import { Icons } from '../../icons/icons.enum';

export interface ProgressBarData {
  value: number;
  color?: string;
  headerTextPrimary?: string | boolean;
  headerTextSecondary?: string | boolean;
  iconHeaderRight?: Icons;
}

export interface ProgressBarConfig {
  disableAnimation?: boolean;
  hideValue?: boolean;
}

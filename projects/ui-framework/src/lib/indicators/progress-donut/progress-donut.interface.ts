import { Icons } from '../../icons/icons.enum';

export interface ProgressDonutData {
  value: number;
  color?: string;
  headerTextPrimary?: string | boolean;
  headerTextSecondary?: string | boolean;
  iconHeaderRight?: Icons;
}

export interface ProgressDonutConfig {
  disableAnimation?: boolean;
  hideValue?: boolean;
}

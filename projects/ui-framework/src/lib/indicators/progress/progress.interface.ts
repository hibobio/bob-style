import { Icons } from '../../icons/icons.enum';
import { Color } from '../../types';
import { ProgressDirection } from './progress.enum';

export interface ProgressData {
  value: number;
  color?: Color;
  trackColor?: Color;
  headerTextPrimary?: string | boolean;
  headerTextSecondary?: string | boolean;
  iconHeaderRight?: Icons;
}

export interface ProgressConfig {
  disableAnimation?: boolean;
  hideValue?: boolean;
  clickable?: boolean;
}

export interface ProgressBarData extends ProgressData {}

export interface ProgressBarConfig extends ProgressConfig {}

export interface ProgressDonutData
  extends Omit<ProgressData, 'iconHeaderRight'> {}

export interface ProgressDonutConfig extends ProgressConfig {
  showValueInCenter?: boolean;
}

export interface MultiProgressBarData
  extends Omit<
    ProgressData,
    | 'trackColor'
    | 'headerTextPrimary'
    | 'headerTextSecondary'
    | 'iconHeaderRight'
  > {}

export interface MultiProgressBarConfig
  extends Omit<ProgressConfig, 'hideValue'> {
  trackColor?: Color;
  total?: number;
  direction?: ProgressDirection;
}
